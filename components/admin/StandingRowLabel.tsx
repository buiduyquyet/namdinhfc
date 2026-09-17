'use client'

import { useRowLabel } from '@payloadcms/ui'

interface StandingRowData {
  position?: number | null
  team?: string | null
  points?: number | null
}

/** Nhãn cho từng hàng khi thu gọn trong admin, ví dụ "1. Ninh Bình — 6 điểm". */
const StandingRowLabel = () => {
  const { data, rowNumber } = useRowLabel<StandingRowData>()

  const position = data?.position ?? (rowNumber ?? 0) + 1
  const team = data?.team?.trim() || 'Đội chưa đặt tên'
  const points = typeof data?.points === 'number' ? ` — ${data.points} điểm` : ''

  return (
    <span>
      {position}. {team}
      {points}
    </span>
  )
}

export default StandingRowLabel
