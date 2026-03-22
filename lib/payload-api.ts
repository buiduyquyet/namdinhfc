import { getPayload } from 'payload'
import config from '@/payload.config'
import { Player } from '@/data/players'

export async function getPayloadPlayers(): Promise<Player[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'players',
      limit: 100,
      sort: 'number'
    })

    return docs.map(doc => {
      let engPos: any = 'forward'
      if (doc.position === 'Thủ môn') engPos = 'goalkeeper'
      if (doc.position === 'Hậu vệ') engPos = 'defender'
      if (doc.position === 'Tiền vệ') engPos = 'midfielder'

      let imageStr = ''
      if (doc.imageUrl) {
        imageStr = doc.imageUrl
      } else if (doc.image && typeof doc.image === 'object' && doc.image.url) {
        imageStr = doc.image.url
      }

      return {
        id: doc.id.toString(),
        name: doc.name,
        slug: doc.name.toLowerCase().replace(/\s+/g, '-'),
        number: doc.number,
        position: engPos,
        nationality: doc.nationality || 'Việt Nam',
        age: 0,
        image: imageStr,
        stats: {
          appearances: doc.stats?.matchesPlayed || 0,
          goals: doc.stats?.goals || 0,
          assists: doc.stats?.assists || 0,
          yellowCards: doc.stats?.yellowCards || 0,
          redCards: doc.stats?.redCards || 0,
        },
        isFeatured: false
      } as Player
    })
  } catch (error) {
    console.error("Failed to fetch players from Payload", error)
    return []
  }
}
