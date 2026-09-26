import {
  leagueStandings as staticStandings,
  type LeagueStandings,
  type LeagueTableEntry,
} from '@/data/league-table'
import type { Competition } from '@/data/matches'
import { parseForm } from '@/lib/league-form'
import { payloadFetch, resolveMediaUrl } from '@/lib/payload-rest'
import type { PayloadListResponse } from '@/lib/payload-rest'
import type { Club, Standing } from '@/payload-types'

type StandingRow = NonNullable<Standing['rows']>[number]

/** Field relationship chỉ là doc đầy đủ khi gọi với `depth >= 1`; `depth=0` trả về ID. */
function toClub(value: string | Club | null | undefined): Club | null {
  return value && typeof value === 'object' ? value : null
}

function mapRow(row: StandingRow): LeagueTableEntry {
  const gf = row.goalsFor
  const ga = row.goalsAgainst

  const club = toClub(row.club)
  // `row.team` là tên đội của các bảng nhập trước khi có collection `clubs`
  const team = club?.name || row.team || 'Chưa xác định'

  return {
    position: row.position,
    team,
    shortName: row.shortName?.trim() || team,
    logo: (club && (resolveMediaUrl(club.logo) || club.logoUrl)) || undefined,
    played: row.played,
    won: row.won,
    drawn: row.drawn,
    lost: row.lost,
    gf,
    ga,
    gd: gf - ga,
    points: row.points,
    form: parseForm(row.form),
  }
}

/**
 * Bảng xếp hạng mùa mới nhất của một giải, lấy từ CMS.
 * - API lỗi → snapshot tĩnh trong `data/league-table.ts` (nếu cùng giải).
 * - CMS chưa có bản ghi → `null` để UI hiện trạng thái đang cập nhật.
 */
export async function getLeagueStandings(
  competition: Competition = 'V.League 1',
): Promise<LeagueStandings | null> {
  const params = new URLSearchParams({
    'where[competition][equals]': competition,
    sort: '-season',
    limit: '1',
    // depth 2: 1 cấp cho row -> club, 1 cấp nữa cho club -> logo (ảnh upload)
    depth: '2',
  })

  try {
    const data = await payloadFetch<PayloadListResponse<Standing>>(`standings?${params.toString()}`)
    const doc = data.docs[0]
    if (!doc) return null

    return {
      competition: doc.competition,
      season: doc.season,
      matchday: doc.matchday ?? undefined,
      entries: (doc.rows ?? []).map(mapRow).sort((a, b) => a.position - b.position),
    }
  } catch (error) {
    console.error('Failed to fetch standings from Payload CMS:', error)
    return staticStandings.competition === competition ? staticStandings : null
  }
}
