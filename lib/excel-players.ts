import ExcelJS from 'exceljs'

export type PlayerPosition = 'Thủ môn' | 'Hậu vệ' | 'Tiền vệ' | 'Tiền đạo'

/** Một dòng Excel đã được chuẩn hoá thành dữ liệu cầu thủ. */
export interface ParsedPlayerRow {
  rowNumber: number
  name: string
  number: number
  position: PlayerPosition
  nationality: string
  /** Ngày sinh dạng ISO — `undefined` khi cột trống hoặc không đọc được. */
  dateOfBirth?: string
  /** Chiều cao (cm) — `undefined` khi cột trống hoặc ngoài khoảng hợp lệ. */
  height?: number
  /** Cân nặng (kg) — `undefined` khi cột trống hoặc ngoài khoảng hợp lệ. */
  weight?: number
}

export interface RowError {
  rowNumber: number
  message: string
}

export interface ParseResult {
  rows: ParsedPlayerRow[]
  errors: RowError[]
}

/**
 * Định nghĩa các cột của file mẫu. `aliases` cho phép người dùng đặt tiêu đề
 * bằng tiếng Anh hoặc không dấu mà vẫn nhận diện được.
 */
const COLUMNS = [
  { key: 'name', header: 'Tên cầu thủ', width: 28, aliases: ['name', 'player'], example: 'Nguyễn Văn A' },
  { key: 'number', header: 'Số áo', width: 10, aliases: ['number', 'shirt number', 'so ao'], example: 10 },
  { key: 'position', header: 'Vị trí', width: 14, aliases: ['position', 'vi tri'], example: 'Tiền vệ' },
  { key: 'nationality', header: 'Quốc tịch', width: 16, aliases: ['nationality', 'quoc tich'], example: 'Việt Nam' },
  { key: 'dateOfBirth', header: 'Ngày sinh', width: 16, aliases: ['date of birth', 'dob', 'birthday', 'ngay sinh'], example: '01/02/1998' },
  { key: 'height', header: 'Chiều cao (cm)', width: 16, aliases: ['height', 'chieu cao', 'chieu cao (cm)'], example: 178 },
  { key: 'weight', header: 'Cân nặng (kg)', width: 16, aliases: ['weight', 'can nang', 'can nang (kg)'], example: 72 },
] as const

type ColumnKey = (typeof COLUMNS)[number]['key']

/** Bỏ dấu tiếng Việt + hạ chữ thường để so khớp tiêu đề cột và vị trí dễ dãi hơn. */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

const POSITION_BY_ALIAS: Record<string, PlayerPosition> = {
  'thu mon': 'Thủ môn',
  gk: 'Thủ môn',
  goalkeeper: 'Thủ môn',
  'hau ve': 'Hậu vệ',
  df: 'Hậu vệ',
  defender: 'Hậu vệ',
  'tien ve': 'Tiền vệ',
  mf: 'Tiền vệ',
  midfielder: 'Tiền vệ',
  'tien dao': 'Tiền đạo',
  fw: 'Tiền đạo',
  forward: 'Tiền đạo',
  striker: 'Tiền đạo',
}

/** Đọc giá trị cell về dạng chuỗi, xử lý cả cell công thức và rich text. */
function cellToString(cell: ExcelJS.Cell | undefined): string {
  const value = cell?.value

  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value instanceof Date) return value.toISOString()

  if (typeof value === 'object') {
    if ('richText' in value) return value.richText.map((part) => part.text).join('').trim()
    if ('result' in value) return String(value.result ?? '').trim()
    if ('text' in value) return String(value.text ?? '').trim()
  }

  return String(value).trim()
}

/** Chuyển cell về số nguyên, trả về `null` nếu không phải số hợp lệ. */
function cellToNumber(cell: ExcelJS.Cell | undefined): number | null {
  const text = cellToString(cell).replace(',', '.')
  if (!text) return null

  const parsed = Number(text)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null
}

/** Ghép ngày sinh về ISO ở mốc 00:00 UTC, `undefined` nếu ngày vô lý. */
function toBirthDateISO(year: number, month: number, day: number): string | undefined {
  if (year < 1900 || year > new Date().getUTCFullYear()) return undefined
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined

  const date = new Date(Date.UTC(year, month - 1, day))
  // Bắt các ngày tràn tháng kiểu 31/02
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return undefined

  return date.toISOString()
}

/**
 * Đọc ô ngày sinh. Nhận cả ô định dạng Date của Excel lẫn chuỗi `dd/MM/yyyy`,
 * `dd-MM-yyyy` và `yyyy-MM-dd`. Ô trống hoặc không đọc được trả `undefined` —
 * ngày sinh là tuỳ chọn nên không làm hỏng cả dòng.
 */
function parseDateOfBirth(cell: ExcelJS.Cell | undefined): string | undefined {
  const raw = cell?.value

  if (raw instanceof Date) {
    return toBirthDateISO(raw.getUTCFullYear(), raw.getUTCMonth() + 1, raw.getUTCDate())
  }

  const text = cellToString(cell)
  if (!text) return undefined

  // yyyy-MM-dd (bao gồm cả chuỗi ISO đầy đủ)
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (iso) return toBirthDateISO(Number(iso[1]), Number(iso[2]), Number(iso[3]))

  // dd/MM/yyyy hoặc dd-MM-yyyy — thứ tự ngày/tháng theo cách viết của người Việt
  const vi = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (vi) return toBirthDateISO(Number(vi[3]), Number(vi[2]), Number(vi[1]))

  return undefined
}

/** Dò hàng tiêu đề (hàng đầu tiên khớp được ít nhất cột `name`). */
function mapHeaderColumns(sheet: ExcelJS.Worksheet): {
  headerRow: number
  columnIndexes: Partial<Record<ColumnKey, number>>
} | null {
  const maxRowsToScan = Math.min(sheet.rowCount, 10)

  for (let rowNumber = 1; rowNumber <= maxRowsToScan; rowNumber++) {
    const row = sheet.getRow(rowNumber)
    const columnIndexes: Partial<Record<ColumnKey, number>> = {}

    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const text = normalize(cellToString(cell))
      if (!text) return

      const column = COLUMNS.find(
        (col) => normalize(col.header) === text || col.aliases.some((alias) => normalize(alias) === text),
      )

      if (column && columnIndexes[column.key] === undefined) {
        columnIndexes[column.key] = colNumber
      }
    })

    if (columnIndexes.name !== undefined) {
      return { headerRow: rowNumber, columnIndexes }
    }
  }

  return null
}

/**
 * Đọc sheet đầu tiên của file Excel thành danh sách cầu thủ.
 * Dòng lỗi không làm hỏng cả file — chúng được gom vào `errors` để báo lại cho người dùng.
 */
export async function parsePlayersWorkbook(buffer: ArrayBuffer): Promise<ParseResult> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)

  const sheet = workbook.worksheets[0]
  if (!sheet) {
    throw new Error('File Excel không có sheet nào.')
  }

  const header = mapHeaderColumns(sheet)
  if (!header) {
    throw new Error(
      `Không tìm thấy hàng tiêu đề. File cần có cột "${COLUMNS[0].header}" — hãy tải file mẫu để đúng định dạng.`,
    )
  }

  const { headerRow, columnIndexes } = header
  const missing = (['number', 'position'] as const).filter((key) => columnIndexes[key] === undefined)
  if (missing.length > 0) {
    const labels = missing.map((key) => COLUMNS.find((col) => col.key === key)!.header)
    throw new Error(`File Excel thiếu cột bắt buộc: ${labels.join(', ')}.`)
  }

  const rows: ParsedPlayerRow[] = []
  const errors: RowError[] = []

  const cellAt = (row: ExcelJS.Row, key: ColumnKey) => {
    const index = columnIndexes[key]
    return index === undefined ? undefined : row.getCell(index)
  }

  /**
   * Chiều cao / cân nặng là tuỳ chọn: cột trống hoặc số vô lý thì bỏ qua,
   * không đánh hỏng cả dòng (khớp với `min`/`max` khai trong collection Players).
   */
  const measureAt = (row: ExcelJS.Row, key: ColumnKey, min: number, max: number) => {
    const value = cellToNumber(cellAt(row, key))
    if (value === null || value < min || value > max) return undefined
    return value
  }

  for (let rowNumber = headerRow + 1; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber)

    const name = cellToString(cellAt(row, 'name'))
    const rawNumber = cellToString(cellAt(row, 'number'))
    const rawPosition = cellToString(cellAt(row, 'position'))

    // Bỏ qua hoàn toàn các dòng trống thay vì báo lỗi
    if (!name && !rawNumber && !rawPosition) continue

    if (!name) {
      errors.push({ rowNumber, message: 'Thiếu tên cầu thủ.' })
      continue
    }

    const shirtNumber = cellToNumber(cellAt(row, 'number'))
    if (shirtNumber === null) {
      errors.push({ rowNumber, message: `Số áo không hợp lệ: "${rawNumber}".` })
      continue
    }

    const position = POSITION_BY_ALIAS[normalize(rawPosition)]
    if (!position) {
      errors.push({
        rowNumber,
        message: `Vị trí không hợp lệ: "${rawPosition}". Chỉ nhận Thủ môn / Hậu vệ / Tiền vệ / Tiền đạo.`,
      })
      continue
    }

    rows.push({
      rowNumber,
      name,
      number: shirtNumber,
      position,
      nationality: cellToString(cellAt(row, 'nationality')) || 'Việt Nam',
      dateOfBirth: parseDateOfBirth(cellAt(row, 'dateOfBirth')),
      height: measureAt(row, 'height', 100, 250),
      weight: measureAt(row, 'weight', 30, 150),
    })
  }

  return { rows, errors }
}

/** Sinh file Excel mẫu (tiêu đề + 1 dòng ví dụ) để người dùng tải về. */
export async function buildPlayersTemplate(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Cầu thủ')

  sheet.columns = COLUMNS.map((col) => ({ header: col.header, key: col.key, width: col.width }))
  sheet.getRow(1).font = { bold: true }
  sheet.addRow(Object.fromEntries(COLUMNS.map((col) => [col.key, col.example])))

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
