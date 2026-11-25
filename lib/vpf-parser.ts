import * as cheerio from 'cheerio'

import { vietnamTimeToISO } from '@/lib/format-date'

/**
 * Đọc HTML của trang mùa giải trên vpf.vn (plugin JoomSport của WordPress).
 * VPF không có API JSON nên phải bóc từ HTML — mọi selector phụ thuộc giao diện
 * của họ nằm gọn trong file này. VPF đổi giao diện thì chỉ cần sửa ở đây.
 *
 * Hàm parse **ném lỗi** khi cấu trúc trang không như mong đợi, để bước đồng bộ
 * dừng hẳn thay vì ghi dữ liệu thiếu vào DB.
 */

export interface VpfMatch {
  /** Số vòng — trận đá bù ("Bù V12", "Bù Vòng 8") vẫn mang số vòng gốc. */
  matchday: number
  /**
   * ISO UTC, đã quy đổi từ giờ Việt Nam. `null` khi VPF chưa chốt ngày — các vòng
   * cuối mùa chỉ ghi "Tháng 05, 2027".
   */
  date: string | null
  homeTeam: string
  awayTeam: string
  venue: string
  /** Chỉ có khi trận đã có tỉ số; trận chưa đá VPF hiện chữ "v". */
  homeScore?: number
  awayScore?: number
}

export interface VpfCalendar {
  /** Dạng `2026/27`, lấy từ tiêu đề vòng đấu. */
  season: string
  matches: VpfMatch[]
}

export interface VpfStandingRow {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

const clean = (value: string) => value.replace(/\s+/g, ' ').trim()

function toInt(value: string, label: string): number {
  const parsed = Number.parseInt(clean(value), 10)
  if (Number.isNaN(parsed)) throw new Error(`Không đọc được số ở cột "${label}": "${clean(value)}"`)
  return parsed
}

/**
 * "04 Tháng 09, 2026" → "2026-09-04".
 * "Tháng 05, 2027" (VPF chưa chốt ngày) → `null`. Còn lại là lỗi cấu trúc.
 */
function parseVietnameseDate(value: string): string | null {
  const text = clean(value)

  const match = text.match(/(\d{1,2})\s+Tháng\s+(\d{1,2}),?\s*(\d{4})/i)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  if (/^Tháng\s+\d{1,2},?\s*\d{4}$/i.test(text)) return null

  throw new Error(`Không đọc được ngày thi đấu: "${text}"`)
}

/** "Vòng 8 …", "Bù V12 …", "Bù Vòng 8 …" → 8 / 12 / 8 */
function parseMatchday(roundName: string): number {
  const match = roundName.match(/(?:Vòng|V)\s*(\d+)/i)
  if (!match) throw new Error(`Không đọc được số vòng từ tiêu đề: "${roundName}"`)
  return Number(match[1])
}

/** Trang lịch thi đấu: `https://vpf.vn/season/<mùa>/?action=calendar` */
export function parseVpfCalendar(html: string): VpfCalendar {
  const $ = cheerio.load(html)
  const matches: VpfMatch[] = []

  let season = ''
  let roundName = ''
  let matchday = 0

  // Tiêu đề vòng và các nhóm theo ngày nằm ngang hàng nhau — duyệt theo thứ tự trong trang
  $('.jsrow-matchday-name, .js-matchday-wrapper').each((_, element) => {
    const node = $(element)

    if (node.hasClass('jsrow-matchday-name')) {
      roundName = clean(node.text())
      matchday = parseMatchday(roundName)
      season ||= roundName.match(/(\d{4}\/\d{2})/)?.[1] ?? ''
      return
    }

    if (!roundName) throw new Error('Gặp trận đấu trước khi gặp tiêu đề vòng đấu.')

    // Nhóm chưa chốt ngày không có `.js-matchday-date`, chỉ có tiêu đề "Tháng 05, 2027"
    const dateNode = node.find('.js-matchday-date')
    const date = parseVietnameseDate((dateNode.length ? dateNode : node.find('.js-matchday-title')).text())

    node.find('.js-matchday-matches > .jstable-row').each((_, row) => {
      const cells = $(row)
      const cell = (selector: string) => clean(cells.find(selector).first().text())

      const homeTeam = cell('.jsMatchDivHome')
      const awayTeam = cell('.jsMatchDivAway')
      if (!homeTeam || !awayTeam) throw new Error(`Thiếu tên đội ở ${roundName}, ngày ${date}.`)

      // Giờ chưa chốt thì VPF để trống — tạm lấy 00:00, lần đồng bộ sau sẽ sửa
      const time = cell('.jsMatchDivTime').match(/\d{1,2}:\d{2}/)?.[0]?.padStart(5, '0') ?? '00:00'
      const score = cell('.jsMatchDivScore').match(/^(\d+)\s*-\s*(\d+)$/)

      matches.push({
        matchday,
        date: date ? vietnamTimeToISO(date, time) : null,
        homeTeam,
        awayTeam,
        venue: cell('.jsMatchDivVenue'),
        ...(score ? { homeScore: Number(score[1]), awayScore: Number(score[2]) } : {}),
      })
    })
  })

  if (!season) throw new Error('Không tìm thấy mùa giải (dạng 2026/27) trong tiêu đề vòng đấu.')
  if (matches.length === 0) throw new Error('Trang lịch thi đấu không có trận nào.')

  return { season, matches }
}

/** Bảng xếp hạng trên trang mùa giải: `https://vpf.vn/season/<mùa>/` */
export function parseVpfStandings(html: string): VpfStandingRow[] {
  const $ = cheerio.load(html)
  const rows: VpfStandingRow[] = []

  const table = $('td.ranking-cell-rank').first().closest('table')
  if (!table.length) throw new Error('Không tìm thấy bảng xếp hạng trên trang mùa giải.')

  table.find('tbody tr').each((_, element) => {
    const row = $(element)
    const cell = (name: string) => row.find(`td.ranking-cell-${name}`).first().text()

    // Cột "Bàn thắng - Bàn thua" có dạng "18 - 7"
    const goals = clean(cell('diff_chk')).match(/^(\d+)\s*-\s*(\d+)$/)
    if (!goals) throw new Error(`Không đọc được cột bàn thắng - bàn thua: "${clean(cell('diff_chk'))}"`)

    rows.push({
      position: toInt(cell('rank'), 'Hạng'),
      team: clean(cell('title')),
      played: toInt(cell('played_chk'), 'Số trận'),
      won: toInt(cell('win_chk'), 'Thắng'),
      drawn: toInt(cell('draw_chk'), 'Hòa'),
      lost: toInt(cell('lost_chk'), 'Thua'),
      goalsFor: Number(goals[1]),
      goalsAgainst: Number(goals[2]),
      points: toInt(cell('point_chk'), 'Điểm'),
    })
  })

  if (rows.length === 0) throw new Error('Bảng xếp hạng không có đội nào.')
  if (rows.some((row) => !row.team)) throw new Error('Có dòng trong bảng xếp hạng thiếu tên đội.')

  return rows
}
