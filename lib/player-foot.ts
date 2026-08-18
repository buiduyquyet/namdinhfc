/** Chân thuận của cầu thủ — dùng chung giữa collection Players và trang chi tiết. */
export type PreferredFoot = 'left' | 'right' | 'both'

export const PREFERRED_FOOT_OPTIONS: { label: string; value: PreferredFoot }[] = [
  { label: 'Chân phải', value: 'right' },
  { label: 'Chân trái', value: 'left' },
  { label: 'Cả hai chân', value: 'both' },
]

/** Nhãn tiếng Việt của chân thuận, chuỗi rỗng khi chưa khai báo. */
export function getPreferredFootLabel(value?: PreferredFoot | null): string {
  return PREFERRED_FOOT_OPTIONS.find((option) => option.value === value)?.label ?? ''
}
