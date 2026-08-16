/** Nguồn gốc dữ liệu của một cầu thủ. */
export type PlayerDataSource = 'excel' | 'manual'

/** Lựa chọn nguồn hiển thị ra trang public, `all` nghĩa là không lọc. */
export type PlayerSourceFilter = PlayerDataSource | 'all'

export const PLAYER_DATA_SOURCE_OPTIONS: { label: string; value: PlayerDataSource }[] = [
  { label: 'Nhập từ Excel', value: 'excel' },
  { label: 'Nhập tay', value: 'manual' },
]

export const PLAYER_SOURCE_FILTER_OPTIONS: { label: string; value: PlayerSourceFilter }[] = [
  { label: 'Tất cả các nguồn', value: 'all' },
  ...PLAYER_DATA_SOURCE_OPTIONS,
]

/**
 * Giá trị `playerDataSource` lưu trong DB có thể là nguồn đã bị gỡ (ví dụ `api-football` cũ).
 * Guard này đảm bảo trang public không lọc theo một giá trị không còn tồn tại.
 */
export function isPlayerSourceFilter(value?: string | null): value is PlayerSourceFilter {
  return PLAYER_SOURCE_FILTER_OPTIONS.some((option) => option.value === value)
}
