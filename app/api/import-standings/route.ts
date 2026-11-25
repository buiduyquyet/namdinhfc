import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { RowError } from '@/lib/excel-clubs'
import { parseStandingsWorkbook } from '@/lib/excel-standings'
import { normalizeText } from '@/lib/normalize-text'
import type { Club, Standing } from '@/payload-types'

const MAX_FILE_SIZE = 5 * 1024 * 1024

/** Khớp tên đội "dễ dãi": bỏ dấu và mọi ký tự không phải chữ/số — "Thể Công – Viettel" = "The Cong - Viettel". */
const clubKey = (name: string) => normalizeText(name).replace(/[^a-z0-9]/g, '')

/** Field relationship ở `depth: 0` là ID, ở depth cao hơn là doc. */
const relationId = (value: string | Club) => (typeof value === 'string' ? value : value.id)

const fail = (error: string, status: number, errors: RowError[] = []) =>
  NextResponse.json({ success: false, error, errors }, { status })

/**
 * Import bảng xếp hạng của một mùa từ Excel — **ghi đè toàn bộ** các đội của bảng đó.
 * Còn một dòng lỗi là không lưu gì, để bảng trên trang không bị thiếu đội.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return fail('Bạn cần đăng nhập để import.', 401)

    const file = (await req.formData()).get('file')
    if (!(file instanceof File)) return fail('Chưa chọn file Excel.', 400)
    if (!/\.xlsx?$/i.test(file.name)) return fail('Chỉ hỗ trợ file .xlsx hoặc .xls.', 400)
    if (file.size > MAX_FILE_SIZE) return fail('File vượt quá 5MB.', 400)

    const parsed = await parseStandingsWorkbook(await file.arrayBuffer())
    const errors: RowError[] = [...parsed.errors]

    if (!parsed.season) {
      return fail('Thiếu mùa giải. Điền ô "Mùa giải" (dạng 2026/27) phía trên bảng — xem file mẫu.', 400, errors)
    }
    if (parsed.rows.length === 0 && errors.length === 0) return fail('File không có đội nào.', 400)

    // Mọi đội phải có sẵn trong mục Đội bóng — logo của bảng lấy theo đó
    const clubs = await payload.find({ collection: 'clubs', pagination: false, depth: 0 })
    const clubByKey = new Map(clubs.docs.map((club) => [clubKey(club.name), club]))

    for (const row of parsed.rows) {
      if (!clubByKey.has(clubKey(row.team))) {
        errors.push({ rowNumber: row.rowNumber, message: `Chưa có đội "${row.team}" trong mục Đội bóng.` })
      }
    }

    if (errors.length) {
      errors.sort((a, b) => a.rowNumber - b.rowNumber)
      return fail(`Chưa lưu bảng xếp hạng vì có ${errors.length} lỗi — sửa file rồi import lại.`, 400, errors)
    }

    const existing = await payload.find({
      collection: 'standings',
      where: { competition: { equals: parsed.competition }, season: { equals: parsed.season } },
      limit: 1,
      depth: 0,
    })
    const doc = existing.docs[0]

    // File không có "Tên ngắn" / "Phong độ" thì giữ giá trị admin đã nhập trước đó
    const previous = new Map((doc?.rows ?? []).map((row) => [relationId(row.club), row]))

    const rows: NonNullable<Standing['rows']> = parsed.rows.map((row) => {
      const club = clubByKey.get(clubKey(row.team))!.id
      const old = previous.get(club)
      return {
        position: row.position,
        club,
        shortName: row.shortName ?? old?.shortName,
        played: row.played,
        won: row.won,
        drawn: row.drawn,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        points: row.points,
        form: row.form ?? old?.form,
      }
    })

    // Không điền "Cập nhật sau vòng" thì lấy số trận nhiều nhất trong bảng
    const matchday = parsed.matchday ?? Math.max(...parsed.rows.map((row) => row.played))
    const data = { competition: parsed.competition, season: parsed.season, matchday, rows }

    if (doc) await payload.update({ collection: 'standings', id: doc.id, data })
    else await payload.create({ collection: 'standings', data })

    return NextResponse.json({
      success: true,
      message: `Đã ${doc ? 'cập nhật' : 'tạo'} bảng ${parsed.competition} · ${parsed.season}, sau vòng ${matchday}.`,
      totalRows: rows.length,
      inserted: doc ? 0 : rows.length,
      updated: doc ? rows.length : 0,
      skipped: [],
      errors: [],
    })
  } catch (error: unknown) {
    return fail(error instanceof Error ? error.message : String(error), 500)
  }
}
