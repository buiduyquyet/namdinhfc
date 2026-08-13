import type { Competition } from '@/data/matches'

/** Các giải đấu CLB tham dự — dùng chung giữa Payload collection và bộ lọc ở `/fixtures`. */
export const COMPETITION_OPTIONS: { label: Competition; value: Competition }[] = [
  { label: 'V.League 1', value: 'V.League 1' },
  { label: 'Cúp Quốc Gia', value: 'Cúp Quốc Gia' },
  { label: 'AFC Champions League Two', value: 'AFC Champions League Two' },
]

const KNOWN_COMPETITIONS = new Set<string>(COMPETITION_OPTIONS.map((option) => option.value))

/** Kiểm tra một giá trị bất kỳ (thường từ query string) có phải giải đấu hợp lệ không. */
export function isCompetition(value?: string | null): value is Competition {
  return !!value && KNOWN_COMPETITIONS.has(value)
}
