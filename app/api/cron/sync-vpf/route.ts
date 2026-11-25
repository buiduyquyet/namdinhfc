import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { runVpfSync } from '@/lib/vpf-sync'

export const dynamic = 'force-dynamic'
// Tải 2 trang VPF (~1.4MB) + vài chục lượt ghi DB
export const maxDuration = 60

function errorResponse(error: unknown) {
  return NextResponse.json(
    { success: false, error: error instanceof Error ? error.message : String(error) },
    { status: 500 },
  )
}

/**
 * Vercel Cron gọi GET kèm header `Authorization: Bearer <CRON_SECRET>` (xem `vercel.json`).
 * Không đặt `CRON_SECRET` thì endpoint này luôn từ chối.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: 'Không có quyền chạy đồng bộ.' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const result = await runVpfSync(payload)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error: unknown) {
    return errorResponse(error)
  }
}

/** Nút "Đồng bộ ngay" trong admin — chỉ user đã đăng nhập. */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Bạn cần đăng nhập để đồng bộ.' }, { status: 401 })
    }

    const result = await runVpfSync(payload)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error: unknown) {
    return errorResponse(error)
  }
}
