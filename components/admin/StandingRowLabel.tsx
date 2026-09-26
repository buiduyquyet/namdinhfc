'use client'

import { useRowLabel } from '@payloadcms/ui'

interface StandingRowData {
  position?: number | null
  /** Bản sao tên CLB, được hook `beforeChange` của collection ghi lại mỗi lần lưu. */
  team?: string | null
  shortName?: string | null
  points?: number | null
}

/**
 * Nhãn cho từng hàng khi thu gọn trong admin, ví dụ "1. Ninh Bình — 6 điểm".
 * Field `club` trong form chỉ là ID nên phải đọc tên đội từ `team`/`shortName` —
 * hàng vừa thêm chưa lưu sẽ hiện "Đội chưa chọn" cho tới lần lưu đầu tiên.
 */
const StandingRowLabel = () => {
  const { data, rowNumber } = useRowLabel<StandingRowData>()

  const position = data?.position ?? (rowNumber ?? 0) + 1
  const team = data?.team?.trim() || data?.shortName?.trim() || 'Đội chưa chọn'
  const points = typeof data?.points === 'number' ? ` — ${data.points} điểm` : ''

  return (
    <span>
      {position}. {team}
      {points}
    </span>
  )
}

export default StandingRowLabel
