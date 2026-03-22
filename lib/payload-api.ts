import { Player, Position } from '@/data/players'

interface PayloadPlayerDoc {
  id: string | number
  name: string
  slug?: string
  number: number
  position: string
  nationality?: string
  imageUrl?: string
  image?: { url?: string }
  stats?: {
    matchesPlayed?: number
    goals?: number
    assists?: number
    yellowCards?: number
    redCards?: number
  }
}

interface PayloadResponse {
  docs: PayloadPlayerDoc[]
}

/** Maps Vietnamese position name to internal Position type */
function mapPosition(viPosition: string): Position {
  if (viPosition === 'Thủ môn') return 'goalkeeper'
  if (viPosition === 'Hậu vệ') return 'defender'
  if (viPosition === 'Tiền vệ') return 'midfielder'
  return 'forward'
}

/** Resolves image URL from Payload document */
function resolveImageUrl(doc: PayloadPlayerDoc): string {
  if (doc.imageUrl) return doc.imageUrl
  if (doc.image && typeof doc.image === 'object' && doc.image.url) return doc.image.url
  return ''
}

/** Fetches players from Payload CMS REST API */
export async function getPayloadPlayers(): Promise<Player[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  try {
    const res = await fetch(`${baseUrl}/api/players?limit=100&sort=number`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error(`Payload API responded with status: ${res.status}`)
    }

    const data: PayloadResponse = await res.json()

    return data.docs.map((doc) => ({
      id: doc.id.toString(),
      name: doc.name,
      slug: doc.name.toLowerCase().replace(/\s+/g, '-'),
      number: doc.number,
      position: mapPosition(doc.position),
      nationality: doc.nationality || 'Việt Nam',
      age: 0,
      image: resolveImageUrl(doc),
      stats: {
        appearances: doc.stats?.matchesPlayed || 0,
        goals: doc.stats?.goals || 0,
        assists: doc.stats?.assists || 0,
        yellowCards: doc.stats?.yellowCards || 0,
        redCards: doc.stats?.redCards || 0,
      },
      isFeatured: false,
    } as Player))

  } catch (error) {
    console.error('Failed to fetch players from Payload CMS:', error)
    return []
  }
}
