import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { clubId, clubKey } from '@/lib/club-key'
import type { RowError } from '@/lib/excel-clubs'
import { parseMatchesWorkbook } from '@/lib/excel-matches'
import type { Match } from '@/payload-types'

const MAX_FILE_SIZE = 5 * 1024 * 1024

const fail = (error: string, status: number) => NextResponse.json({ success: false, error }, { status })

/** Mùa giải tính từ tháng 7 năm trước tới tháng 6 năm sau, VD: trận 03/2027 thuộc mùa bắt đầu 2026. */
function seasonStartYear(iso: string): number {
  // Lệch vài giờ UTC không đổi được tháng 7 ↔ tháng 6, nên đọc thẳng UTC là đủ
  const date = new Date(iso)
  return date.getUTCMonth() >= 6 ? date.getUTCFullYear() : date.getUTCFullYear() - 1
}

/**
 * Import / cập nhật trận đấu từ Excel.
 * Trận đã có = cùng giải + đội nhà + đội khách + mùa giải → cập nhật (kể cả khi đổi ngày).
 * Ô trống trong file giữ nguyên giá trị cũ. Dòng lỗi bị bỏ qua, các dòng khác vẫn lưu.
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

    const { rows, errors: parseErrors } = await parseMatchesWorkbook(await file.arrayBuffer())
    const errors: RowError[] = [...parseErrors]

    const clubs = await payload.find({ collection: 'clubs', pagination: false, depth: 0 })
    const clubByKey = new Map(clubs.docs.map((club) => [clubKey(club.name), club]))

    let inserted = 0
    let updated = 0
    const skipped: { rowNumber: number; name: string }[] = []
    const seen = new Set<string>()

    for (const row of rows) {
      const label = `${row.homeTeam} vs ${row.awayTeam}`
      const home = clubByKey.get(clubKey(row.homeTeam))
      const away = clubByKey.get(clubKey(row.awayTeam))

      if (!home || !away) {
        const missing = [!home && row.homeTeam, !away && row.awayTeam].filter(Boolean).join('", "')
        errors.push({ rowNumber: row.rowNumber, message: `Chưa có đội "${missing}" trong mục Đội bóng.` })
        continue
      }

      const season = seasonStartYear(row.date)
      const key = `${row.competition}|${home.id}|${away.id}|${season}`
      if (seen.has(key)) {
        errors.push({ rowNumber: row.rowNumber, message: `${label}: trận này xuất hiện 2 lần trong file.` })
        continue
      }
      seen.add(key)

      const hasScore = row.homeScore !== undefined && row.awayScore !== undefined

      try {
        const candidates = await payload.find({
          collection: 'matches',
          where: {
            competition: { equals: row.competition },
            homeClub: { equals: home.id },
            awayClub: { equals: away.id },
          },
          pagination: false,
          depth: 0,
        })
        const current = candidates.docs.find((doc) => seasonStartYear(doc.date) === season)

        if (!current) {
          await payload.create({
            collection: 'matches',
            data: {
              date: row.date,
              homeClub: home.id,
              awayClub: away.id,
              competition: row.competition,
              matchday: row.matchday,
              status: hasScore ? 'Đã kết thúc' : 'Chưa đá',
              homeScore: row.homeScore,
              awayScore: row.awayScore,
              stadium: row.stadium,
              ticketUrl: row.ticketUrl,
              highlightUrl: row.highlightUrl,
            },
          })
          inserted++
          continue
        }

        // Chỉ ghi ô có giá trị trong file và khác với CMS
        const patch: Partial<Match> = {}
        if (new Date(current.date).getTime() !== new Date(row.date).getTime()) patch.date = row.date
        if (row.matchday !== undefined && row.matchday !== current.matchday) patch.matchday = row.matchday
        if (hasScore && (row.homeScore !== current.homeScore || row.awayScore !== current.awayScore)) {
          patch.homeScore = row.homeScore
          patch.awayScore = row.awayScore
        }
        if (hasScore && current.status !== 'Đã kết thúc') patch.status = 'Đã kết thúc'
        if (row.stadium && row.stadium !== current.stadium) patch.stadium = row.stadium
        if (row.ticketUrl && row.ticketUrl !== current.ticketUrl) patch.ticketUrl = row.ticketUrl
        if (row.highlightUrl && row.highlightUrl !== current.highlightUrl) patch.highlightUrl = row.highlightUrl

        if (Object.keys(patch).length === 0) {
          skipped.push({ rowNumber: row.rowNumber, name: label })
          continue
        }

        // Kèm 2 đội để hook `fillTitle` của Matches dựng lại tiêu đề đúng
        await payload.update({
          collection: 'matches',
          id: current.id,
          data: { ...patch, homeClub: clubId(current.homeClub), awayClub: clubId(current.awayClub) },
        })
        updated++
      } catch (error: unknown) {
        errors.push({
          rowNumber: row.rowNumber,
          message: `${label}: ${error instanceof Error ? error.message : String(error)}`,
        })
      }
    }

    errors.sort((a, b) => a.rowNumber - b.rowNumber)

    return NextResponse.json({
      success: true,
      totalRows: rows.length + parseErrors.length,
      inserted,
      updated,
      skipped,
      errors,
    })
  } catch (error: unknown) {
    return fail(error instanceof Error ? error.message : String(error), 500)
  }
}
