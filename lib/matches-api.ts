import {
  TEAM_NAME,
  finishedMatches as staticFinished,
  upcomingMatches as staticUpcoming,
  type Competition,
  type Match,
  type MatchStatus,
} from '@/data/matches'
import { toVietnamDateParts } from '@/lib/format-date'
import { payloadFetch, resolveMediaUrl } from '@/lib/payload-rest'
import type { PayloadListResponse } from '@/lib/payload-rest'
import type { Match as PayloadMatch } from '@/payload-types'

/** Trạng thái tiếng Việt trong CMS → trạng thái nội bộ của UI. */
const STATUS_BY_LABEL: Record<PayloadMatch['status'], MatchStatus> = {
  'Chưa đá': 'upcoming',
  'Đã kết thúc': 'finished',
  'Đang diễn ra': 'live',
  'Bị hoãn': 'postponed',
}

function mapMatch(doc: PayloadMatch): Match {
  const { date, time } = toVietnamDateParts(doc.date)

  return {
    id: doc.id.toString(),
    homeTeam: doc.homeTeam,
    awayTeam: doc.awayTeam,
    homeScore: doc.homeScore ?? undefined,
    awayScore: doc.awayScore ?? undefined,
    date,
    time,
    venue: doc.stadium || 'Chưa xác định',
    competition: doc.competition as Competition,
    status: STATUS_BY_LABEL[doc.status],
    matchday: doc.matchday ?? undefined,
    isHomeGame: doc.homeTeam === TEAM_NAME,
    homeLogo: resolveMediaUrl(doc.homeLogo) || undefined,
    awayLogo: resolveMediaUrl(doc.awayLogo) || undefined,
    ticketUrl: doc.ticketUrl || undefined,
    highlightUrl: doc.highlightUrl || undefined,
  }
}

interface GetMatchesArgs {
  /** Lọc theo nhóm trạng thái. `upcoming` gồm cả trận bị hoãn. */
  group?: 'upcoming' | 'finished'
  competition?: Competition
  limit?: number
}

const UPCOMING_LABELS: PayloadMatch['status'][] = ['Chưa đá', 'Đang diễn ra', 'Bị hoãn']
const FINISHED_LABELS: PayloadMatch['status'][] = ['Đã kết thúc']

/**
 * Lịch thi đấu / kết quả từ CMS.
 * Trận sắp tới sắp xếp tăng dần theo ngày, trận đã đá giảm dần (mới nhất trước).
 * Khi gọi API lỗi thì trả dữ liệu tĩnh trong `data/matches.ts` để trang không trống trơn.
 */
export async function getMatches({
  group = 'upcoming',
  competition,
  limit = 100,
}: GetMatchesArgs = {}): Promise<Match[]> {
  const labels = group === 'finished' ? FINISHED_LABELS : UPCOMING_LABELS

  const params = new URLSearchParams({
    sort: group === 'finished' ? '-date' : 'date',
    depth: '1',
    limit: String(limit),
  })

  labels.forEach((label, index) => {
    params.set(`where[or][${index}][status][equals]`, label)
  })

  if (competition) params.set('where[competition][equals]', competition)

  try {
    const data = await payloadFetch<PayloadListResponse<PayloadMatch>>(
      `matches?${params.toString()}`,
    )
    return data.docs.map(mapMatch)
  } catch (error) {
    console.error('Failed to fetch matches from Payload CMS:', error)

    const fallback = group === 'finished' ? staticFinished : staticUpcoming
    const filtered = competition
      ? fallback.filter((match) => match.competition === competition)
      : fallback

    return filtered.slice(0, limit)
  }
}

/** Trận kế tiếp — dùng cho `NextMatchSection` ở trang chủ. */
export async function getNextMatch(): Promise<Match | null> {
  const matches = await getMatches({ group: 'upcoming', limit: 1 })
  return matches[0] ?? null
}

/** N kết quả gần nhất — dùng cho `LatestResultsSection`. */
export async function getLatestResults(limit = 3): Promise<Match[]> {
  return getMatches({ group: 'finished', limit })
}

export interface MatchMonthGroup {
  /** Mốc ISO của trận đầu tiên trong nhóm, dùng để sinh nhãn tháng. */
  key: string
  matches: Match[]
}

/** Gom danh sách trận theo tháng, giữ nguyên thứ tự đã sắp xếp từ trước. */
export function groupMatchesByMonth(matches: Match[]): MatchMonthGroup[] {
  const groups: MatchMonthGroup[] = []

  for (const match of matches) {
    const monthKey = match.date.slice(0, 7)
    const last = groups.at(-1)

    if (last && last.key.slice(0, 7) === monthKey) {
      last.matches.push(match)
    } else {
      groups.push({ key: match.date, matches: [match] })
    }
  }

  return groups
}
