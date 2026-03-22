import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getSquadData } from '@/lib/api-football'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const players = await getSquadData()

    let inserted = 0;
    let updated = 0;

    for (const player of players) {
      let pos = 'Tiền đạo'
      if (player.position === 'goalkeeper') pos = 'Thủ môn'
      else if (player.position === 'defender') pos = 'Hậu vệ'
      else if (player.position === 'midfielder') pos = 'Tiền vệ'
      else if (player.position === 'forward') pos = 'Tiền đạo'

      const playerData = {
        name: player.name,
        number: player.number || 0,
        position: pos as 'Thủ môn' | 'Hậu vệ' | 'Tiền vệ' | 'Tiền đạo',
        nationality: player.nationality || 'Việt Nam',
        imageUrl: typeof player.image === 'string' ? player.image : undefined,
        stats: {
          matchesPlayed: player.stats?.appearances || 0,
          goals: player.stats?.goals || 0,
          assists: player.stats?.assists || 0,
          yellowCards: 0,
          redCards: 0,
        }
      }

      // Check if player already exists
      const existing = await payload.find({
        collection: 'players',
        where: { name: { equals: player.name } }
      })

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'players',
          data: playerData
        })
        inserted++
      } else {
        await payload.update({
          collection: 'players',
          id: existing.docs[0].id,
          data: playerData
        })
        updated++
      }
    }

    return NextResponse.json({ success: true, inserted, updated, total: players.length })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
