import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { parseClubsWorkbook, type RowError } from '@/lib/excel-clubs'

const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Chỉ cho phép user đã đăng nhập admin gọi endpoint ghi dữ liệu này
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Bạn cần đăng nhập để import.' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Chưa chọn file Excel.' }, { status: 400 })
    }

    if (!/\.xlsx?$/i.test(file.name)) {
      return NextResponse.json({ success: false, error: 'Chỉ hỗ trợ file .xlsx hoặc .xls.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File vượt quá 5MB.' }, { status: 400 })
    }

    const { rows, errors: parseErrors } = await parseClubsWorkbook(await file.arrayBuffer())
    const errors: RowError[] = [...parseErrors]

    let inserted = 0
    let updated = 0
    const skipped: { rowNumber: number; name: string }[] = []
    const seenNames = new Set<string>()

    for (const row of rows) {
      const nameKey = row.name.toLowerCase()

      // Trùng ngay trong file: chỉ giữ lần xuất hiện đầu tiên
      if (seenNames.has(nameKey)) {
        skipped.push({ rowNumber: row.rowNumber, name: row.name })
        continue
      }
      seenNames.add(nameKey)

      try {
        const existing = await payload.find({
          collection: 'clubs',
          where: { name: { equals: row.name } },
          limit: 1,
          depth: 0,
        })

        const current = existing.docs[0]

        if (current) {
          // Import lại để làm mới giải đấu / mùa giải / link logo.
          // Không đụng tới logo đã upload thủ công — file Excel chỉ bù vào chỗ trống.
          await payload.update({
            collection: 'clubs',
            id: current.id,
            data: {
              league: row.league,
              ...(row.season ? { season: row.season } : {}),
              ...(row.logoUrl && !current.logo ? { logoUrl: row.logoUrl } : {}),
            },
          })
          updated++
          continue
        }

        await payload.create({
          collection: 'clubs',
          data: {
            name: row.name,
            league: row.league,
            season: row.season,
            logoUrl: row.logoUrl,
          },
        })
        inserted++
      } catch (error: unknown) {
        errors.push({
          rowNumber: row.rowNumber,
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return NextResponse.json({
      success: true,
      totalRows: rows.length + parseErrors.length,
      inserted,
      updated,
      skipped,
      errors,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
