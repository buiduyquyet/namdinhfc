import { normalizeText } from '@/lib/normalize-text'

/** Hệ thống giải đấu của một CLB trong collection `clubs`. */
export type ClubLeague = 'V.League 1' | 'Hạng Nhất Quốc gia' | 'Khác'

/** Dùng chung giữa collection `Clubs` và bộ lọc trong admin. */
export const CLUB_LEAGUE_OPTIONS: { label: ClubLeague; value: ClubLeague }[] = [
  { label: 'V.League 1', value: 'V.League 1' },
  { label: 'Hạng Nhất Quốc gia', value: 'Hạng Nhất Quốc gia' },
  { label: 'Khác', value: 'Khác' },
]

/** Các cách viết tên giải hay gặp trong file Excel của VPF (đã bỏ dấu, chữ thường). */
const LEAGUE_BY_ALIAS: Record<string, ClubLeague> = {
  'v.league 1': 'V.League 1',
  'v.league1': 'V.League 1',
  'v league 1': 'V.League 1',
  'v-league 1': 'V.League 1',
  'vleague 1': 'V.League 1',
  'vleague1': 'V.League 1',
  'hang nhat quoc gia': 'Hạng Nhất Quốc gia',
  'giai hang nhat quoc gia': 'Hạng Nhất Quốc gia',
  'hang nhat': 'Hạng Nhất Quốc gia',
  'v.league 2': 'Hạng Nhất Quốc gia',
  'vleague 2': 'Hạng Nhất Quốc gia',
}

/** Mùa giải viết theo dạng `2026/27`. */
export const SEASON_PATTERN = /^\d{4}\/\d{2}$/

export interface ParsedLeagueCell {
  league: ClubLeague
  /** `undefined` khi ô không kèm mùa giải trong ngoặc. */
  season?: string
}

/**
 * Tách ô "Giải đấu" của file VPF thành giải đấu + mùa giải:
 * "V.League 1 (2026/27)" -> `{ league: 'V.League 1', season: '2026/27' }`.
 * Không nhận ra tên giải thì trả về 'Khác' để dòng đó vẫn import được.
 */
export function parseLeagueCell(raw: string): ParsedLeagueCell {
  const seasonMatch = raw.match(/\((\d{4}\s*\/\s*\d{2})\)/)
  const season = seasonMatch ? seasonMatch[1].replace(/\s+/g, '') : undefined

  const withoutSeason = raw.replace(/\([^)]*\)/g, ' ')
  const league = LEAGUE_BY_ALIAS[normalizeText(withoutSeason)] ?? 'Khác'

  return { league, season }
}
