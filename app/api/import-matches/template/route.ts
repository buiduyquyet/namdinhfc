import { NextResponse } from 'next/server'

import { buildMatchesTemplate } from '@/lib/excel-matches'

export async function GET() {
  const buffer = await buildMatchesTemplate()

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="mau-import-tran-dau.xlsx"',
    },
  })
}
