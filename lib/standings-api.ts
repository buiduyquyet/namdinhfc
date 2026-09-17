import {
  leagueStandings as staticStandings,
  type LeagueStandings,
  type LeagueTableEntry,
} from '@/data/league-table'
import type { Competition } from '@/data/matches'
import { parseForm } from '@/lib/league-form'
import { payloadFetch } from '@/lib/payload-rest'
import type { PayloadListResponse } from '@/lib/payload-rest'
import type { Standing } from '@/payload-types'

type StandingRow = NonNullable<Standing['rows']>[number]

function mapRow(row: StandingRow): LeagueTableEntry {
  const gf = row.goalsFor
  const ga = row.goalsAgainst

  return {
    position: row.position,
    team: row.team,
    shortName: row.shortName?.trim() || row.team,
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
