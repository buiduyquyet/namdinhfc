import { Player, Position } from '@/data/players'
import { FEATURED_PLAYERS_LIMIT } from '@/lib/featured-players'
import { isPlayerSourceFilter, type PlayerSourceFilter } from '@/lib/player-source'
import { payloadFetch, resolveMediaUrl } from '@/lib/payload-rest'
import type { PayloadListResponse } from '@/lib/payload-rest'
import type { Player as PayloadPlayer, SiteSetting } from '@/payload-types'

/** Maps Vietnamese position name to internal Position type */
function mapPosition(viPosition: PayloadPlayer['position']): Position {
  if (viPosition === 'Thủ môn') return 'goalkeeper'
  if (viPosition === 'Hậu vệ') return 'defender'
  if (viPosition === 'Tiền vệ') return 'midfielder'
  return 'forward'
}

/** Resolves image URL from Payload document */
function resolveImageUrl(doc: PayloadPlayer): string {
  return doc.imageUrl || resolveMediaUrl(doc.image)
}

/**
 * Tính tuổi từ ngày sinh. Trả về `0` khi chưa có ngày sinh hoặc giá trị không hợp lệ —
 * phía UI đã bỏ qua các giá trị `0` khi tính độ tuổi trung bình.
 */
function calculateAge(dateOfBirth?: string | null): number {
  if (!dateOfBirth) return 0

  const birth = new Date(dateOfBirth)
  if (Number.isNaN(birth.getTime())) return 0

  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()

  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())

  if (!hasHadBirthdayThisYear) age--

  return age > 0 && age < 120 ? age : 0
}

/**
 * Đọc nguồn dữ liệu cầu thủ đang được chọn trong global "Cấu hình trang".
 * Trả về `all` nếu global chưa được lưu lần nào, gọi lỗi, hoặc giá trị đã lưu
 * là một nguồn không còn tồn tại (ví dụ `api-football` cũ).
 */
export async function getActivePlayerSource(): Promise<PlayerSourceFilter> {
  try {
    const data = await payloadFetch<Partial<SiteSetting>>('globals/site-settings')
    return isPlayerSourceFilter(data.playerDataSource) ? data.playerDataSource : 'all'
  } catch (error) {
    console.error('Failed to fetch site settings from Payload CMS:', error)
    return 'all'
  }
}

function mapPlayer(doc: PayloadPlayer): Player {
  return {
    id: doc.id.toString(),
    name: doc.name,
    slug: doc.name.toLowerCase().replace(/\s+/g, '-'),
    number: doc.number,
    position: mapPosition(doc.position),
    nationality: doc.nationality || 'Việt Nam',
    age: calculateAge(doc.dateOfBirth),
    height: doc.height ?? undefined,
    weight: doc.weight ?? undefined,
    image: resolveImageUrl(doc),
    isFeatured: doc.isFeatured ?? false,
  }
}

/**
 * Query cầu thủ, luôn kèm bộ lọc nguồn dữ liệu đang chọn trong "Cấu hình trang".
 * `extraParams` là các cặp query của Payload REST cần nối thêm.
 */
async function fetchPlayers(limit: number, extraParams = ''): Promise<Player[]> {
  const source = await getActivePlayerSource()
  const sourceQuery = source === 'all' ? '' : `&where[dataSource][equals]=${source}`

  const data = await payloadFetch<PayloadListResponse<PayloadPlayer>>(
    `players?limit=${limit}&sort=number&depth=1${sourceQuery}${extraParams}`,
  )

  return data.docs.map(mapPlayer)
}

/** Fetches players from Payload CMS REST API, filtered by the configured data source */
export async function getPayloadPlayers(): Promise<Player[]> {
  try {
    return await fetchPlayers(100)
  } catch (error) {
    console.error('Failed to fetch players from Payload CMS:', error)
    return []
  }
}

/**
 * Cầu thủ được tick "Cầu thủ nổi bật" trong admin, tối đa `FEATURED_PLAYERS_LIMIT`.
 * Chưa tick ai thì trả rỗng — phía UI tự ẩn section thay vì dựng danh sách thay thế.
 */
export async function getFeaturedPlayers(): Promise<Player[]> {
  try {
    return await fetchPlayers(FEATURED_PLAYERS_LIMIT, '&where[isFeatured][equals]=true')
  } catch (error) {
    console.error('Failed to fetch featured players from Payload CMS:', error)
    return []
  }
}
