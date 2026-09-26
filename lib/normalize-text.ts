/**
 * Bỏ dấu tiếng Việt + hạ chữ thường để so khớp "dễ dãi" (tiêu đề cột Excel,
 * tên giải đấu, tên vị trí…). Không dùng cho slug — slug đã có `lib/slug.ts`.
 * "Hạng Nhất Quốc gia" -> "hang nhat quoc gia"
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}
