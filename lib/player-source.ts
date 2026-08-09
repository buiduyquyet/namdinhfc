/** Nguồn gốc dữ liệu của một cầu thủ. */
export type PlayerDataSource = 'api-football' | 'excel' | 'manual'

/** Lựa chọn nguồn hiển thị ra trang public, `all` nghĩa là không lọc. */
export type PlayerSourceFilter = PlayerDataSource | 'all'

export const PLAYER_DATA_SOURCE_OPTIONS: { label: string; value: PlayerDataSource }[] = [
  { label: 'API Football', value: 'api-football' },
  { label: 'Nhập từ Excel', value: 'excel' },
  { label: 'Nhập tay', value: 'manual' },
]

export const PLAYER_SOURCE_FILTER_OPTIONS: { label: string; value: PlayerSourceFilter }[] = [
  { label: 'Tất cả các nguồn', value: 'all' },
  ...PLAYER_DATA_SOURCE_OPTIONS,
]
