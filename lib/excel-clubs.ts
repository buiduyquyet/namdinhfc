import ExcelJS from 'exceljs'

import { parseLeagueCell, type ClubLeague } from '@/lib/club-league'
import { normalizeText } from '@/lib/normalize-text'

/** Một dòng Excel đã được chuẩn hoá thành dữ liệu đội bóng. */
export interface ParsedClubRow {
  rowNumber: number
  name: string
  league: ClubLeague
  /** `undefined` khi ô "Giải đấu" không kèm mùa giải trong ngoặc. */
  season?: string
  /** Link logo ngoài — `undefined` khi cột trống hoặc không phải URL http(s). */
  logoUrl?: string
}

export interface RowError {
  rowNumber: number
  message: string
}

export interface ParseResult {
  rows: ParsedClubRow[]
  errors: RowError[]
}

/**
 * Định nghĩa các cột của file mẫu, bám theo file "Logo doi bong vpf.xlsx".
 * `aliases` cho phép tiêu đề tiếng Anh hoặc không dấu vẫn nhận diện được.
 */
const COLUMNS = [
  {
    key: 'league',
    header: 'Giải đấu',
    width: 26,
    aliases: ['league', 'competition', 'giai dau'],
    example: 'V.League 1 (2026/27)',
  },
  {
    key: 'name',
    header: 'Tên đội',
    width: 30,
    aliases: ['name', 'team', 'club', 'ten doi', 'ten clb', 'ten cau lac bo'],
    example: 'Thép Xanh Nam Định',
  },
  {
    key: 'logoUrl',
    header: 'Link logo (vpf.vn)',
    width: 60,
    aliases: ['logo', 'link logo', 'logo url', 'url logo', 'link logo (vpf.vn)'],
    example: 'https://vpf.vn/wp-content/uploads/2018/10/Logo-Nam-Dinh.png',
  },
] as const

type ColumnKey = (typeof COLUMNS)[number]['key']

/** Đọc giá trị cell về dạng chuỗi, xử lý cả cell công thức, hyperlink và rich text. */
function cellToString(cell: ExcelJS.Cell | undefined): string {
  const value = cell?.value

  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value instanceof Date) return value.toISOString()

  if (typeof value === 'object') {
    if ('richText' in value) return value.richText.map((part) => part.text).join('').trim()
    // Ô link logo thường là hyperlink: ưu tiên địa chỉ thật thay vì text hiển thị
    if ('hyperlink' in value) return String(value.hyperlink ?? value.text ?? '').trim()
    if ('result' in value) return String(value.result ?? '').trim()
    if ('text' in value) return String(value.text ?? '').trim()
  }

  return String(value).trim()
}

/** Chỉ nhận link http(s); giá trị khác coi như bỏ trống để không lưu rác vào CMS. */
function toLogoUrl(raw: string): string | undefined {
  if (!/^https?:\/\/\S+$/i.test(raw)) return undefined
  return raw
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
      const text = normalizeText(cellToString(cell))
      if (!text) return

      const column = COLUMNS.find(
        (col) =>
          normalizeText(col.header) === text ||
          col.aliases.some((alias) => normalizeText(alias) === text),
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
 * Đọc sheet đầu tiên của file Excel thành danh sách đội bóng.
 * Dòng lỗi không làm hỏng cả file — chúng được gom vào `errors` để báo lại cho người dùng.
 */
export async function parseClubsWorkbook(buffer: ArrayBuffer): Promise<ParseResult> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)

  const sheet = workbook.worksheets[0]
  if (!sheet) {
    throw new Error('File Excel không có sheet nào.')
  }

  const header = mapHeaderColumns(sheet)
  if (!header) {
    throw new Error(
      'Không tìm thấy hàng tiêu đề. File cần có cột "Tên đội" — hãy tải file mẫu để đúng định dạng.',
    )
  }

  const { headerRow, columnIndexes } = header
  const rows: ParsedClubRow[] = []
  const errors: RowError[] = []

  const cellAt = (row: ExcelJS.Row, key: ColumnKey) => {
    const index = columnIndexes[key]
    return index === undefined ? undefined : row.getCell(index)
  }

  for (let rowNumber = headerRow + 1; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber)

    const name = cellToString(cellAt(row, 'name'))
    const rawLeague = cellToString(cellAt(row, 'league'))
    const rawLogo = cellToString(cellAt(row, 'logoUrl'))

    // Bỏ qua hoàn toàn các dòng trống thay vì báo lỗi
    if (!name && !rawLeague && !rawLogo) continue

    if (!name) {
      errors.push({ rowNumber, message: 'Thiếu tên đội.' })
      continue
    }

    const { league, season } = parseLeagueCell(rawLeague)

    rows.push({ rowNumber, name, league, season, logoUrl: toLogoUrl(rawLogo) })
  }

  return { rows, errors }
}

/** Sinh file Excel mẫu (tiêu đề + 1 dòng ví dụ) để người dùng tải về. */
export async function buildClubsTemplate(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Đội bóng')

  sheet.columns = COLUMNS.map((col) => ({ header: col.header, key: col.key, width: col.width }))
  sheet.getRow(1).font = { bold: true }
  sheet.addRow(Object.fromEntries(COLUMNS.map((col) => [col.key, col.example])))

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
