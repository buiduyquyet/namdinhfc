/** Chuyên mục của một bài viết. */
export type NewsCategory = 'doi-bong' | 'tran-dau' | 'chuyen-nhuong' | 'cong-dong'

export const NEWS_CATEGORY_OPTIONS: { label: string; value: NewsCategory }[] = [
  { label: 'Tin đội bóng', value: 'doi-bong' },
  { label: 'Trận đấu', value: 'tran-dau' },
  { label: 'Chuyển nhượng', value: 'chuyen-nhuong' },
  { label: 'Cộng đồng', value: 'cong-dong' },
]

const LABEL_BY_CATEGORY = new Map(
  NEWS_CATEGORY_OPTIONS.map((option) => [option.value, option.label]),
)

/** Nhãn tiếng Việt của chuyên mục, mặc định "Tin đội bóng" nếu giá trị lạ. */
export function getCategoryLabel(category?: string | null): string {
  return LABEL_BY_CATEGORY.get(category as NewsCategory) ?? 'Tin đội bóng'
}

/** Kiểm tra một giá trị bất kỳ (thường từ query string) có phải chuyên mục hợp lệ không. */
export function isNewsCategory(value?: string | null): value is NewsCategory {
  return !!value && LABEL_BY_CATEGORY.has(value as NewsCategory)
}
