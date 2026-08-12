const DATE_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
})

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Ho_Chi_Minh',
})

function toDate(value: string): Date | null {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** "12/08/2026" — trả chuỗi rỗng nếu ngày không hợp lệ. */
export function formatDate(value: string): string {
  const date = toDate(value)
  return date ? DATE_FORMATTER.format(date) : ''
}

/** "12/08/2026 19:15" */
export function formatDateTime(value: string): string {
  const date = toDate(value)
  return date ? DATE_TIME_FORMATTER.format(date) : ''
}

/** Định dạng `datetime` cho thẻ `<time>` — chỉ phần ngày, an toàn cho SEO. */
export function toISODate(value: string): string {
  const date = toDate(value)
  return date ? date.toISOString().slice(0, 10) : ''
}
