import { NextResponse } from 'next/server'

import { buildStandingsTemplate } from '@/lib/excel-standings'

export async function GET() {
  const buffer = await buildStandingsTemplate()

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="mau-import-bang-xep-hang.xlsx"',
    },
  })
}
