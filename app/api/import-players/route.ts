import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { parsePlayersWorkbook, type RowError } from '@/lib/excel-players'

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

    const { rows, errors: parseErrors } = await parsePlayersWorkbook(await file.arrayBuffer())
    const errors: RowError[] = [...parseErrors]

    let inserted = 0
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

      const existing = await payload.find({
        collection: 'players',
        where: { name: { equals: row.name } },
        limit: 1,
        depth: 0,
      })

      if (existing.totalDocs > 0) {
        skipped.push({ rowNumber: row.rowNumber, name: row.name })
        continue
      }

      try {
        await payload.create({
          collection: 'players',
          data: {
            name: row.name,
            number: row.number,
            position: row.position,
            nationality: row.nationality,
            dateOfBirth: row.dateOfBirth,
            height: row.height,
            weight: row.weight,
            dataSource: 'excel',
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
