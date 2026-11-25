import type { Payload } from 'payload'

import type { MatchResult } from '@/data/league-table'
import { TEAM_NAME } from '@/data/matches'
import { FORM_MAX_LENGTH, LETTER_BY_RESULT } from '@/lib/league-form'
import { normalizeText } from '@/lib/normalize-text'
import { parseVpfCalendar, parseVpfStandings, type VpfCalendar, type VpfStandingRow } from '@/lib/vpf-parser'
import { buildVpfUrls, DEFAULT_VPF_SEASON_URL } from '@/lib/vpf-source'
import type { Club, Match, Standing } from '@/payload-types'

/**
 * Đồng bộ V.League 1 từ vpf.vn vào CMS:
 * - `matches`: chỉ các trận của CLB — tạo trận mới, cập nhật ngày giờ / vòng / tỉ số.
 * - `standings`: ghi đè bảng của mùa hiện tại bằng BXH của VPF (thứ hạng do VPF xếp).
 *
 * Mọi bước kiểm tra chạy **trước** khi ghi: thiếu đội, lệch danh sách đội… thì dừng
 * hẳn, không ghi gì, để dữ liệu cũ trên trang vẫn đúng.
 */

const COMPETITION = 'V.League 1'

export interface VpfSyncSummary {
  season: string
  matchesCreated: number
  matchesUpdated: number
  /** Vòng mới nhất đã có kết quả — ghi vào ô "Cập nhật sau vòng" của BXH. */
  standingsMatchday: number
}

export type VpfSyncResult =
  | ({ success: true; message: string } & VpfSyncSummary)
  | { success: false; error: string }

type ClubResolver = (vpfName: string) => Club | undefined

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  })
  if (!res.ok) throw new Error(`vpf.vn trả lỗi ${res.status} khi tải ${url}`)
  return res.text()
}

/** Khớp tên "dễ dãi": bỏ dấu và mọi ký tự không phải chữ/số — "Thể Công – Viettel" = "The Cong - Viettel". */
const clubKey = (name: string) => normalizeText(name).replace(/[^a-z0-9]/g, '')

/** Field relationship ở `depth: 0` là ID, ở depth cao hơn là doc. */
const relationId = (value: string | Club) => (typeof value === 'string' ? value : value.id)

function buildClubResolver(clubs: Club[]): ClubResolver {
  const byKey = new Map<string, Club>()
  clubs.forEach((club) => byKey.set(clubKey(club.name), club))
  // "Tên trên VPF" do admin điền tay nên được ưu tiên — ghi sau để đè
  clubs.forEach((club) => club.vpfName && byKey.set(clubKey(club.vpfName), club))
  return (vpfName) => byKey.get(clubKey(vpfName))
}

/** Kiểm tra chéo hai trang VPF và việc khớp tên đội. Ném lỗi để dừng toàn bộ lần đồng bộ. */
function validate(calendar: VpfCalendar, standings: VpfStandingRow[], resolve: ClubResolver) {
  const teams = new Set(calendar.matches.flatMap((match) => [match.homeTeam, match.awayTeam]))

  if (standings.length !== teams.size || standings.some((row) => !teams.has(row.team))) {
    throw new Error('Danh sách đội ở bảng xếp hạng và lịch thi đấu của VPF không khớp nhau.')
  }

  const missing = [...teams].filter((name) => !resolve(name))
  if (missing.length) {
    throw new Error(
      `Chưa có đội bóng nào khớp với tên trên VPF: ${missing.join(', ')}. ` +
        'Thêm đội trong mục Đội bóng hoặc điền ô "Tên trên VPF" cho đội tương ứng.',
    )
  }

  const clubIds = new Set([...teams].map((name) => resolve(name)?.id))
  if (clubIds.size !== teams.size) throw new Error('Có hai đội trên VPF cùng khớp vào một đội bóng trong CMS.')
}

/** "2026/27" → khoảng [01/07/2026, 01/07/2027) theo giờ Việt Nam, dùng để tìm trận đã có trong mùa. */
function seasonRange(season: string): [string, string] {
  const startYear = Number(season.slice(0, 4))
  return [`${startYear}-07-01T00:00:00+07:00`, `${startYear + 1}-07-01T00:00:00+07:00`].map((value) =>
    new Date(value).toISOString(),
  ) as [string, string]
}

async function syncClubMatches(
  payload: Payload,
  calendar: VpfCalendar,
  resolve: ClubResolver,
  ourClub: Club,
): Promise<{ created: number; updated: number }> {
  const [from, to] = seasonRange(calendar.season)
  const existing = await payload.find({
    collection: 'matches',
    where: {
      competition: { equals: COMPETITION },
      date: { greater_than_equal: from, less_than: to },
      or: [{ homeClub: { equals: ourClub.id } }, { awayClub: { equals: ourClub.id } }],
    },
    pagination: false,
    depth: 0,
  })

  const byPair = new Map<string, Match>()
  existing.docs.forEach((doc) => byPair.set(`${relationId(doc.homeClub)}|${relationId(doc.awayClub)}`, doc))

  let created = 0
  let updated = 0

  for (const match of calendar.matches) {
    const homeClub = resolve(match.homeTeam)!.id
    const awayClub = resolve(match.awayTeam)!.id
    if (homeClub !== ourClub.id && awayClub !== ourClub.id) continue

    const hasScore = match.homeScore !== undefined && match.awayScore !== undefined
    const doc = byPair.get(`${homeClub}|${awayClub}`)

    if (!doc) {
      // VPF chưa chốt ngày thì chưa tạo — lần đồng bộ sau sẽ tạo khi đã có lịch
      if (!match.date) continue

      await payload.create({
        collection: 'matches',
        data: {
          date: match.date,
          homeClub,
          awayClub,
          competition: COMPETITION,
          matchday: match.matchday,
          stadium: match.venue || undefined,
          status: hasScore ? 'Đã kết thúc' : 'Chưa đá',
          ...(hasScore ? { homeScore: match.homeScore, awayScore: match.awayScore } : {}),
        },
      })
      created++
      continue
    }

    // Chỉ ghi các ô lấy từ VPF. Sân, link vé, link highlight admin nhập tay được giữ nguyên.
    // VPF chưa có tỉ số thì không đụng tới tỉ số / trạng thái đã nhập tay.
    const patch: Partial<Match> = {}
    if (match.date && new Date(match.date).getTime() !== new Date(doc.date).getTime()) patch.date = match.date
    if (doc.matchday !== match.matchday) patch.matchday = match.matchday
    if (hasScore && (doc.homeScore !== match.homeScore || doc.awayScore !== match.awayScore)) {
      patch.homeScore = match.homeScore
      patch.awayScore = match.awayScore
    }
    if (hasScore && doc.status !== 'Đã kết thúc') patch.status = 'Đã kết thúc'

    if (Object.keys(patch).length === 0) continue

    // Kèm 2 đội để hook `fillTitle` của Matches dựng lại tiêu đề đúng
    await payload.update({ collection: 'matches', id: doc.id, data: { ...patch, homeClub, awayClub } })
    updated++
  }

  return { created, updated }
}

/** Phong độ 5 trận gần nhất của từng đội (cũ → mới), tính từ các trận đã có tỉ số. */
function computeForms(calendar: VpfCalendar): Map<string, string> {
  const forms = new Map<string, string>()
  const push = (team: string, result: MatchResult) =>
    forms.set(team, ((forms.get(team) ?? '') + LETTER_BY_RESULT[result]).slice(-FORM_MAX_LENGTH))

  calendar.matches
    .filter((match) => match.date && match.homeScore !== undefined && match.awayScore !== undefined)
    .sort((a, b) => a.date!.localeCompare(b.date!))
    .forEach(({ homeTeam, awayTeam, homeScore = 0, awayScore = 0 }) => {
      push(homeTeam, homeScore > awayScore ? 'W' : homeScore < awayScore ? 'L' : 'D')
      push(awayTeam, awayScore > homeScore ? 'W' : awayScore < homeScore ? 'L' : 'D')
    })

  return forms
}

async function syncStandings(
  payload: Payload,
  calendar: VpfCalendar,
  standings: VpfStandingRow[],
  resolve: ClubResolver,
): Promise<number> {
  const existing = await payload.find({
    collection: 'standings',
    where: { competition: { equals: COMPETITION }, season: { equals: calendar.season } },
    limit: 1,
    depth: 0,
  })
  const doc = existing.docs[0]

  // Giữ "Tên ngắn" admin đã đặt cho từng đội
  const shortNames = new Map<string, string>()
  doc?.rows?.forEach((row) => row.shortName && shortNames.set(relationId(row.club), row.shortName))

  const forms = computeForms(calendar)
  const rows: NonNullable<Standing['rows']> = standings.map((row) => {
    const club = resolve(row.team)!.id
    return {
      position: row.position,
      club,
      shortName: shortNames.get(club),
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      points: row.points,
      form: forms.get(row.team) ?? '',
    }
  })

  const matchday = Math.max(
    0,
    ...calendar.matches.filter((match) => match.homeScore !== undefined).map((match) => match.matchday),
  )

  const data = { competition: COMPETITION, season: calendar.season, matchday, rows } as const

  if (doc) await payload.update({ collection: 'standings', id: doc.id, data })
  else await payload.create({ collection: 'standings', data })

  return matchday
}

async function syncVpf(payload: Payload, seasonUrl: string): Promise<VpfSyncSummary> {
  const urls = buildVpfUrls(seasonUrl)
  const [calendarHtml, standingsHtml] = await Promise.all([fetchHtml(urls.calendar), fetchHtml(urls.standings)])

  const calendar = parseVpfCalendar(calendarHtml)
  const standings = parseVpfStandings(standingsHtml)

  const clubs = await payload.find({ collection: 'clubs', pagination: false, depth: 0 })
  const resolve = buildClubResolver(clubs.docs)

  validate(calendar, standings, resolve)

  const ourClub = resolve(TEAM_NAME)
  if (!ourClub) throw new Error(`Không tìm thấy đội "${TEAM_NAME}" trong mục Đội bóng.`)

  const { created, updated } = await syncClubMatches(payload, calendar, resolve, ourClub)
  const standingsMatchday = await syncStandings(payload, calendar, standings, resolve)

  return { season: calendar.season, matchesCreated: created, matchesUpdated: updated, standingsMatchday }
}

/** Chạy đồng bộ và ghi kết quả vào Cấu hình trang → "Đồng bộ kết quả từ VPF". Không bao giờ ném lỗi. */
export async function runVpfSync(payload: Payload): Promise<VpfSyncResult> {
  const lastRunAt = new Date().toISOString()
  let seasonUrl = DEFAULT_VPF_SEASON_URL

  // Gửi kèm `seasonUrl` vì cập nhật group có thể thay cả object — thiếu là mất link mùa giải
  const writeLog = (lastStatus: 'success' | 'error', lastMessage: string) =>
    payload
      .updateGlobal({
        slug: 'site-settings',
        data: { vpfSync: { seasonUrl, lastRunAt, lastStatus, lastMessage } },
      })
      .catch((error: unknown) => console.error('Failed to write VPF sync log:', error))

  try {
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    seasonUrl = settings.vpfSync?.seasonUrl || DEFAULT_VPF_SEASON_URL
    const summary = await syncVpf(payload, seasonUrl)

    const message =
      `Mùa ${summary.season}: thêm ${summary.matchesCreated} trận, cập nhật ${summary.matchesUpdated} trận. ` +
      `Bảng xếp hạng cập nhật sau vòng ${summary.standingsMatchday}.`

    await writeLog('success', message)
    return { success: true, message, ...summary }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('VPF sync failed:', error)
    await writeLog('error', message)
    return { success: false, error: message }
  }
}
