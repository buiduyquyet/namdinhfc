import { NextResponse } from 'next/server'

import { buildPlayersTemplate } from '@/lib/excel-players'

export async function GET() {
  const buffer = await buildPlayersTemplate()

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="mau-import-cau-thu.xlsx"',
    },
  })
}
