import ExcelJS from 'exceljs'

export type PlayerPosition = 'Thủ môn' | 'Hậu vệ' | 'Tiền vệ' | 'Tiền đạo'

/** Một dòng Excel đã được chuẩn hoá thành dữ liệu cầu thủ. */
export interface ParsedPlayerRow {
  rowNumber: number
  name: string
  number: number
  position: PlayerPosition
  nationality: string
  stats: {
    matchesPlayed: number
    goals: number
    assists: number
    yellowCards: number
    redCards: number
  }
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
  { key: 'matchesPlayed', header: 'Số trận', width: 10, aliases: ['matches', 'appearances', 'so tran'], example: 0 },
  { key: 'goals', header: 'Bàn thắng', width: 12, aliases: ['goals', 'ban thang'], example: 0 },
  { key: 'assists', header: 'Kiến tạo', width: 12, aliases: ['assists', 'kien tao'], example: 0 },
  { key: 'yellowCards', header: 'Thẻ vàng', width: 12, aliases: ['yellow cards', 'the vang'], example: 0 },
  { key: 'redCards', header: 'Thẻ đỏ', width: 12, aliases: ['red cards', 'the do'], example: 0 },
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

  const statAt = (row: ExcelJS.Row, key: ColumnKey) => Math.max(0, cellToNumber(cellAt(row, key)) ?? 0)

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
      stats: {
        matchesPlayed: statAt(row, 'matchesPlayed'),
        goals: statAt(row, 'goals'),
        assists: statAt(row, 'assists'),
        yellowCards: statAt(row, 'yellowCards'),
        redCards: statAt(row, 'redCards'),
      },
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
