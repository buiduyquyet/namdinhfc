import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { getSquadData } from '@/lib/api-football'
import type { Position } from '@/data/players'
import type { Player as PayloadPlayer } from '@/payload-types'

const POSITION_LABELS: Record<Position, PayloadPlayer['position']> = {
  goalkeeper: 'Thủ môn',
  defender: 'Hậu vệ',
  midfielder: 'Tiền vệ',
  forward: 'Tiền đạo',
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Endpoint này ghi thẳng vào DB nên chỉ cho phép user đã đăng nhập admin gọi
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập để đồng bộ dữ liệu.' },
        { status: 401 },
      )
    }

    const players = await getSquadData()

    let inserted = 0
    let updated = 0

    for (const player of players) {
      const playerData = {
        name: player.name,
        number: player.number || 0,
        position: POSITION_LABELS[player.position],
        nationality: player.nationality || 'Việt Nam',
        imageUrl: typeof player.image === 'string' ? player.image : undefined,
        dataSource: 'api-football' as const,
        stats: {
          matchesPlayed: player.stats?.appearances || 0,
          goals: player.stats?.goals || 0,
          assists: player.stats?.assists || 0,
          yellowCards: 0,
          redCards: 0,
        },
      }

      // Check if player already exists
      const existing = await payload.find({
        collection: 'players',
        where: { name: { equals: player.name } },
        limit: 1,
        depth: 0,
      })

      if (existing.totalDocs === 0) {
        await payload.create({ collection: 'players', data: playerData })
        inserted++
      } else {
        await payload.update({
          collection: 'players',
          id: existing.docs[0].id,
          data: playerData,
        })
        updated++
      }
    }

    return NextResponse.json({ success: true, inserted, updated, total: players.length })
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
