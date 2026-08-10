import { Player, Position } from '@/data/players'
import type { PlayerSourceFilter } from '@/lib/player-source'
import type { Player as PayloadPlayer, SiteSetting } from '@/payload-types'

interface PayloadListResponse<T> {
  docs: T[]
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
  if (doc.imageUrl) return doc.imageUrl
  if (doc.image && typeof doc.image === 'object' && doc.image.url) return doc.image.url
  return ''
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

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000/'
}

/**
 * Đọc nguồn dữ liệu cầu thủ đang được chọn trong global "Cấu hình trang".
 * Trả về `all` nếu global chưa được lưu lần nào hoặc gọi lỗi.
 */
export async function getActivePlayerSource(): Promise<PlayerSourceFilter> {
  try {
    const res = await fetch(`${getBaseUrl()}api/globals/site-settings`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) return 'all'

    const data: Partial<SiteSetting> = await res.json()
    return data.playerDataSource || 'all'
  } catch (error) {
    console.error('Failed to fetch site settings from Payload CMS:', error)
    return 'all'
  }
}

/** Fetches players from Payload CMS REST API, filtered by the configured data source */
export async function getPayloadPlayers(): Promise<Player[]> {
  const baseUrl = getBaseUrl()

  try {
    const source = await getActivePlayerSource()
    const sourceQuery = source === 'all' ? '' : `&where[dataSource][equals]=${source}`

    const res = await fetch(`${baseUrl}api/players?limit=100&sort=number${sourceQuery}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error(`Payload API responded with status: ${res.status}`)
    }

    const data: PayloadListResponse<PayloadPlayer> = await res.json()

    return data.docs.map((doc) => ({
      id: doc.id.toString(),
      name: doc.name,
      slug: doc.name.toLowerCase().replace(/\s+/g, '-'),
      number: doc.number,
      position: mapPosition(doc.position),
      nationality: doc.nationality || 'Việt Nam',
      age: calculateAge(doc.dateOfBirth),
      image: resolveImageUrl(doc),
      stats: {
        appearances: doc.stats?.matchesPlayed || 0,
        goals: doc.stats?.goals || 0,
        assists: doc.stats?.assists || 0,
        yellowCards: doc.stats?.yellowCards || 0,
        redCards: doc.stats?.redCards || 0,
      },
      isFeatured: false,
    }))
  } catch (error) {
    console.error('Failed to fetch players from Payload CMS:', error)
    return []
  }
}
