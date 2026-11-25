import { normalizeText } from '@/lib/normalize-text'
import type { Club } from '@/payload-types'

/**
 * Khoá so khớp tên đội "dễ dãi": bỏ dấu và mọi ký tự không phải chữ/số, nên
 * "Thể Công – Viettel" = "The Cong - Viettel", "Công an TP. Hồ Chí Minh" = "Cong an TP Ho Chi Minh".
 * Dùng khi import Excel để tìm đội trong collection `clubs`.
 */
export const clubKey = (name: string) => normalizeText(name).replace(/[^a-z0-9]/g, '')

/** Field relationship tới `clubs` ở `depth: 0` là ID, ở depth cao hơn là doc. */
export const clubId = (value: string | Club) => (typeof value === 'string' ? value : value.id)
