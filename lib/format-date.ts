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

const VN_PARTS_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Ho_Chi_Minh',
})

/**
 * Tách một mốc ISO thành ngày `YYYY-MM-DD` và giờ `HH:mm` **theo giờ Việt Nam**.
 * Payload lưu ngày giờ ở UTC nên phải quy đổi, nếu không trận 19:15 tối sẽ lệch ngày.
 */
export function toVietnamDateParts(value: string): { date: string; time: string } {
  const parsed = toDate(value)
  if (!parsed) return { date: '', time: '' }

  const parts = VN_PARTS_FORMATTER.formatToParts(parsed)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  const hour = get('hour') === '24' ? '00' : get('hour')

  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${hour}:${get('minute')}`,
  }
}

const MONTH_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
})

/** "tháng 3 năm 2026" — dùng làm tiêu đề nhóm ở trang Lịch thi đấu. */
export function formatMonthLabel(value: string): string {
  const date = toDate(value)
  return date ? MONTH_FORMATTER.format(date) : ''
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  timeZone: 'Asia/Ho_Chi_Minh',
})

/** "Th 7, 22/03" */
export function formatWeekdayDate(value: string): string {
  const date = toDate(value)
  return date ? WEEKDAY_FORMATTER.format(date) : ''
}
