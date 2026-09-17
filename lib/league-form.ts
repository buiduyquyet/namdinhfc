import type { MatchResult } from '@/data/league-table'

/**
 * Phong độ trong CMS được nhập dạng chuỗi ký tự tiếng Việt, xếp từ trận cũ → trận mới:
 * T = Thắng, H = Hòa, B = Bại (thua). Ví dụ: "THBTT".
 */
export const FORM_MAX_LENGTH = 5

const RESULT_BY_LETTER: Record<string, MatchResult> = { T: 'W', H: 'D', B: 'L' }

export const LETTER_BY_RESULT: Record<MatchResult, string> = { W: 'T', D: 'H', L: 'B' }

export const RESULT_LABEL: Record<MatchResult, string> = { W: 'Thắng', D: 'Hòa', L: 'Thua' }

/** Chuẩn hoá chuỗi admin nhập: bỏ khoảng trắng / dấu phân cách, viết hoa. */
export function normalizeFormInput(value?: string | null): string {
  return (value ?? '').toUpperCase().replace(/[^A-Z]/g, '')
}

/** Trả `true` hoặc message lỗi tiếng Việt — dùng làm `validate` của field Payload. */
export function validateFormInput(value?: string | null): true | string {
  const form = normalizeFormInput(value)
  if (!/^[THB]*$/.test(form)) return 'Chỉ dùng các ký tự T (thắng), H (hòa), B (thua).'
  if (form.length > FORM_MAX_LENGTH) return `Tối đa ${FORM_MAX_LENGTH} trận gần nhất.`
  return true
}

/** Chuỗi phong độ trong CMS → mảng kết quả của UI, giữ tối đa 5 trận gần nhất. */
export function parseForm(value?: string | null): MatchResult[] {
  return normalizeFormInput(value)
    .split('')
    .map((letter) => RESULT_BY_LETTER[letter])
    .filter((result): result is MatchResult => !!result)
    .slice(-FORM_MAX_LENGTH)
}
