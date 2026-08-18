import { Player, Position } from '@/data/players'
import { FEATURED_PLAYERS_LIMIT } from '@/lib/featured-players'
import type { PreferredFoot } from '@/lib/player-foot'
import { isPlayerSourceFilter, type PlayerSourceFilter } from '@/lib/player-source'
import { payloadFetch, resolveMediaUrl } from '@/lib/payload-rest'
import type { PayloadListResponse } from '@/lib/payload-rest'
import { slugify } from '@/lib/slug'
import type { Player as PayloadPlayer, SiteSetting } from '@/payload-types'

/**
 * Cầu thủ kèm các thông tin chỉ dùng ở trang chi tiết `/squad/[slug]`.
 * Tách khỏi `Player` để danh sách và card không phải tải theo nội dung tiểu sử.
 */
export interface PlayerDetail extends Player {
  preferredFoot?: PreferredFoot
  /** Ngày gia nhập CLB, dạng ISO. */
  joinedDate?: string
  /** Ngày sinh dạng ISO — trang chi tiết hiện ngày, không chỉ số tuổi. */
  dateOfBirth?: string
  bio: PayloadPlayer['bio']
}

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

/**
 * Slug của cầu thủ. Các bản ghi tạo trước khi có field `slug` chưa có giá trị,
 * nên sinh tạm từ tên để link không chết — lưu lại trong admin là có slug thật.
 */
function resolveSlug(doc: PayloadPlayer): string {
  return doc.slug?.trim() || slugify(doc.name)
}

function mapPlayer(doc: PayloadPlayer): Player {
  return {
    id: doc.id.toString(),
    name: doc.name,
    slug: resolveSlug(doc),
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

function mapPlayerDetail(doc: PayloadPlayer): PlayerDetail {
  return {
    ...mapPlayer(doc),
    preferredFoot: doc.preferredFoot ?? undefined,
    joinedDate: doc.joinedDate ?? undefined,
    dateOfBirth: doc.dateOfBirth ?? undefined,
    bio: doc.bio ?? null,
  }
}

/**
 * Một cầu thủ theo slug. Trả `null` khi không tìm thấy để page gọi `notFound()`.
 * Không lọc theo nguồn dữ liệu: người dùng vào bằng link trực tiếp vẫn xem được.
 */
export async function getPlayerBySlug(slug: string): Promise<PlayerDetail | null> {
  try {
    const bySlug = await payloadFetch<PayloadListResponse<PayloadPlayer>>(
      `players?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
    )
    if (bySlug.docs[0]) return mapPlayerDetail(bySlug.docs[0])

    // Bản ghi tạo trước khi có field `slug` chưa có giá trị trong DB —
    // dò lại bằng slug sinh từ tên để link cũ không chết.
    const legacy = await payloadFetch<PayloadListResponse<PayloadPlayer>>(
      `players?where[slug][exists]=false&limit=200&depth=1`,
    )
    const matched = legacy.docs.find((doc) => slugify(doc.name) === slug)
    return matched ? mapPlayerDetail(matched) : null
  } catch (error) {
    console.error(`Failed to fetch player "${slug}" from Payload CMS:`, error)
    return null
  }
}

/** Cầu thủ cùng vị trí, loại trừ người đang xem — hiện ở cuối trang chi tiết. */
export async function getSquadmates(current: Player, limit = 4): Promise<Player[]> {
  const players = await getPayloadPlayers()

  return players
    .filter((player) => player.position === current.position && player.id !== current.id)
    .slice(0, limit)
}
