import { NextResponse } from 'next/server'

import { buildClubsTemplate } from '@/lib/excel-clubs'

export async function GET() {
  const buffer = await buildClubsTemplate()

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="mau-import-doi-bong.xlsx"',
    },
  })
}
