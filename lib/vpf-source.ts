/**
 * Cấu hình nguồn VPF dùng chung giữa global `SiteSettings` và bước đồng bộ.
 * Tách riêng khỏi `lib/vpf-sync.ts` để file config của Payload không phải kéo theo
 * bộ parse HTML.
 */

/** Mỗi mùa VPF đổi slug (v-league-2027, v-league-2028…) — admin cập nhật trong Cấu hình trang. */
export const DEFAULT_VPF_SEASON_URL = 'https://vpf.vn/season/v-league-2027/'

const SEASON_PATH = /^\/season\/[a-z0-9-]+\/?$/i

/** Trả `true` hoặc message lỗi tiếng Việt — dùng làm `validate` của field Payload. */
export function validateVpfSeasonUrl(value?: string | null): true | string {
  if (!value) return true

  try {
    const url = new URL(value)
    if (url.hostname !== 'vpf.vn') return 'Link phải thuộc trang vpf.vn.'
    if (!SEASON_PATH.test(url.pathname)) return 'Link phải có dạng https://vpf.vn/season/v-league-2027/'
    return true
  } catch {
    return 'Link không hợp lệ.'
  }
}

/** Từ link mùa giải → link trang BXH (chính trang mùa) và trang lịch thi đấu đầy đủ. */
export function buildVpfUrls(seasonUrl: string): { standings: string; calendar: string } {
  const valid = validateVpfSeasonUrl(seasonUrl)
  if (valid !== true) throw new Error(`Link mùa giải VPF không hợp lệ: ${valid}`)

  const base = new URL(seasonUrl)
  base.search = ''
  base.hash = ''
  if (!base.pathname.endsWith('/')) base.pathname += '/'

  const calendar = new URL(base)
  calendar.searchParams.set('action', 'calendar')
  calendar.searchParams.set('pagejs', '1')

  return { standings: base.toString(), calendar: calendar.toString() }
}
