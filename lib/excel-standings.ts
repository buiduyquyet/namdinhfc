import ExcelJS from 'exceljs'

import type { Competition } from '@/data/matches'
import { SEASON_PATTERN } from '@/lib/club-league'
import { COMPETITION_OPTIONS } from '@/lib/competition'
import { cellToString, type RowError } from '@/lib/excel-clubs'
import { normalizeFormInput, validateFormInput } from '@/lib/league-form'
import { normalizeText } from '@/lib/normalize-text'

/** Một dòng Excel đã chuẩn hoá thành 1 đội trong bảng xếp hạng. */
export interface ParsedStandingRow {
  rowNumber: number
  position: number
  team: string
  /** `undefined` khi file không có cột "Tên ngắn" hoặc ô trống — giữ giá trị cũ trong CMS. */
  shortName?: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
  /** `undefined` khi file không có cột "Phong độ" hoặc ô trống — giữ giá trị cũ trong CMS. */
  form?: string
}

export interface ParsedStandings {
  competition: Competition
  /** `undefined` khi file thiếu ô "Mùa giải" — route sẽ báo lỗi. */
  season?: string
  /** `undefined` khi file thiếu ô "Cập nhật sau vòng" — route tự suy ra từ số trận. */
  matchday?: number
  rows: ParsedStandingRow[]
  errors: RowError[]
}

/** So khớp tiêu đề "dễ dãi": bỏ dấu, hoa thường và khoảng trắng — "BT - BB" = "bt-bb". */
const headerKey = (value: string) => normalizeText(value).replace(/\s+/g, '')

/**
 * Các cột của bảng. `aliases` gồm cả tiêu đề trên vpf.vn (VT, Đội bóng, T, H, B, BT - BB…)
 * để có thể copy bảng từ VPF dán thẳng vào file.
 */
const COLUMNS = [
  { key: 'position', header: 'Hạng', width: 8, aliases: ['vt', 'vi tri', 'stt', '#', 'pos', 'rank'], example: 1 },
  {
    key: 'team',
    header: 'Tên đội',
    width: 30,
    aliases: ['doi bong', 'doi', 'clb', 'team', 'club'],
    example: 'Thép Xanh Nam Định',
  },
  { key: 'played', header: 'Số trận', width: 10, aliases: ['tran', 'st', 'played', 'pld', 'mp'], example: 8 },
  { key: 'won', header: 'Thắng', width: 9, aliases: ['t', 'w', 'won'], example: 6 },
  { key: 'drawn', header: 'Hòa', width: 9, aliases: ['h', 'hoa', 'drawn'], example: 1 },
  { key: 'lost', header: 'Thua', width: 9, aliases: ['b', 'bai', 'l', 'lost'], example: 1 },
  { key: 'goalsFor', header: 'Bàn thắng', width: 11, aliases: ['bt', 'gf'], example: 18 },
  { key: 'goalsAgainst', header: 'Bàn thua', width: 11, aliases: ['bb', 'ga'], example: 7 },
  /** Cột gộp kiểu VPF: "18 - 7". Chỉ dùng khi file không có 2 cột tách riêng. */
  { key: 'goals', header: 'BT - BB', width: 0, aliases: ['ban thang - ban thua'], example: undefined },
  { key: 'points', header: 'Điểm', width: 9, aliases: ['pts', 'points'], example: 19 },
  { key: 'form', header: 'Phong độ', width: 12, aliases: ['form'], example: 'TTHTT' },
  { key: 'shortName', header: 'Tên ngắn', width: 16, aliases: ['short name'], example: undefined },
] as const

type ColumnKey = (typeof COLUMNS)[number]['key']

/** Ô thông tin đặt phía trên bảng: nhãn ở cột A, giá trị ở cột B. */
const META_LABELS = {
  competition: ['giai dau', 'giai', 'competition'],
  season: ['mua giai', 'mua', 'season'],
  matchday: ['cap nhat sau vong', 'sau vong', 'vong', 'matchday'],
} as const

const MAX_HEADER_SCAN = 15

function findColumn(text: string): ColumnKey | undefined {
  const key = headerKey(text)
  return COLUMNS.find(
    (col) => headerKey(col.header) === key || col.aliases.some((alias) => headerKey(alias) === key),
  )?.key
}

/** Hàng tiêu đề = hàng đầu tiên có cả cột tên đội và cột điểm. */
function mapHeaderColumns(sheet: ExcelJS.Worksheet) {
  for (let rowNumber = 1; rowNumber <= Math.min(sheet.rowCount, MAX_HEADER_SCAN); rowNumber++) {
    const columnIndexes: Partial<Record<ColumnKey, number>> = {}

    sheet.getRow(rowNumber).eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const column = findColumn(cellToString(cell))
      if (column && columnIndexes[column] === undefined) columnIndexes[column] = colNumber
    })

    if (columnIndexes.team !== undefined && columnIndexes.points !== undefined) {
      return { headerRow: rowNumber, columnIndexes }
    }
  }
  return null
}

function readMeta(sheet: ExcelJS.Worksheet, headerRow: number, errors: RowError[]) {
  let competition: Competition = 'V.League 1'
  let season: string | undefined
  let matchday: number | undefined

  for (let rowNumber = 1; rowNumber < headerRow; rowNumber++) {
    const row = sheet.getRow(rowNumber)
    const label = normalizeText(cellToString(row.getCell(1)).replace(/:$/, ''))
    const value = cellToString(row.getCell(2))
    if (!label || !value) continue

    if ((META_LABELS.competition as readonly string[]).includes(label)) {
      const found = COMPETITION_OPTIONS.find((option) => normalizeText(option.value) === normalizeText(value))
      if (found) competition = found.value
      else errors.push({ rowNumber, message: `Không nhận ra giải đấu "${value}".` })
    } else if ((META_LABELS.season as readonly string[]).includes(label)) {
      const normalized = value.replace(/\s+/g, '')
      if (SEASON_PATTERN.test(normalized)) season = normalized
      else errors.push({ rowNumber, message: `Mùa giải "${value}" phải có dạng 2026/27.` })
    } else if ((META_LABELS.matchday as readonly string[]).includes(label)) {
      const parsed = Number(value)
      if (Number.isInteger(parsed) && parsed >= 0) matchday = parsed
      else errors.push({ rowNumber, message: `Số vòng "${value}" không hợp lệ.` })
    }
  }

  return { competition, season, matchday }
}

/** Ô số nguyên. Trả message lỗi khi không hợp lệ. */
function toInt(raw: string, label: string, allowNegative = false): number | string {
  if (!/^-?\d+$/.test(raw)) return raw ? `Cột "${label}" phải là số nguyên (đang là "${raw}").` : `Thiếu cột "${label}".`
  const value = Number(raw)
  if (!allowNegative && value < 0) return `Cột "${label}" không được âm.`
  return value
}

/**
 * Đọc sheet đầu tiên thành bảng xếp hạng. Lỗi từng dòng được gom vào `errors`;
 * route quyết định không lưu gì nếu còn lỗi để bảng trên trang không bị thiếu đội.
 */
export async function parseStandingsWorkbook(buffer: ArrayBuffer): Promise<ParsedStandings> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)

  const sheet = workbook.worksheets[0]
  if (!sheet) throw new Error('File Excel không có sheet nào.')

  const header = mapHeaderColumns(sheet)
  if (!header) {
    throw new Error('Không tìm thấy hàng tiêu đề. File cần có cột "Tên đội" và "Điểm" — hãy tải file mẫu.')
  }

  const { headerRow, columnIndexes } = header
  const hasSplitGoals = columnIndexes.goalsFor !== undefined && columnIndexes.goalsAgainst !== undefined
  if (!hasSplitGoals && columnIndexes.goals === undefined) {
    throw new Error('File cần cột "Bàn thắng" và "Bàn thua" (hoặc cột gộp "BT - BB" như trên vpf.vn).')
  }

  const errors: RowError[] = []
  const meta = readMeta(sheet, headerRow, errors)
  const rows: ParsedStandingRow[] = []

  for (let rowNumber = headerRow + 1; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber)
    const cell = (key: ColumnKey) => {
      const index = columnIndexes[key]
      return index === undefined ? '' : cellToString(row.getCell(index))
    }

    const team = cell('team')
    if (!team && !cell('points') && !cell('position')) continue // dòng trống
    if (!team) {
      errors.push({ rowNumber, message: 'Thiếu tên đội.' })
      continue
    }

    // Cột gộp "18 - 7" của VPF
    const goals = hasSplitGoals ? null : cell('goals').match(/^(\d+)\s*-\s*(\d+)$/)
    const numbers = {
      position: toInt(cell('position'), 'Hạng'),
      played: toInt(cell('played'), 'Số trận'),
      won: toInt(cell('won'), 'Thắng'),
      drawn: toInt(cell('drawn'), 'Hòa'),
      lost: toInt(cell('lost'), 'Thua'),
      goalsFor: hasSplitGoals ? toInt(cell('goalsFor'), 'Bàn thắng') : goals ? Number(goals[1]) : 'Cột "BT - BB" phải có dạng 18 - 7.',
      goalsAgainst: hasSplitGoals ? toInt(cell('goalsAgainst'), 'Bàn thua') : goals ? Number(goals[2]) : 0,
      // Đội bị trừ điểm có thể âm
      points: toInt(cell('points'), 'Điểm', true),
    }

    const messages = Object.values(numbers).filter((value): value is string => typeof value === 'string')
    const formCheck = validateFormInput(cell('form'))
    if (formCheck !== true) messages.push(`Phong độ: ${formCheck}`)
    if (messages.length) {
      errors.push({ rowNumber, message: `${team}: ${messages.join(' ')}` })
      continue
    }

    const parsed = numbers as { [K in keyof typeof numbers]: number }
    if (parsed.won + parsed.drawn + parsed.lost !== parsed.played) {
      errors.push({
        rowNumber,
        message: `${team}: Thắng + Hòa + Thua (${parsed.won + parsed.drawn + parsed.lost}) khác Số trận (${parsed.played}) — kiểm tra lại thứ tự cột.`,
      })
      continue
    }

    rows.push({
      rowNumber,
      team,
      ...parsed,
      shortName: cell('shortName') || undefined,
      form: normalizeFormInput(cell('form')) || undefined,
    })
  }

  // Trùng hạng / trùng đội trong cùng file
  const seenPositions = new Set<number>()
  const seenTeams = new Set<string>()
  for (const row of rows) {
    const teamKey = headerKey(row.team)
    if (seenPositions.has(row.position)) errors.push({ rowNumber: row.rowNumber, message: `Trùng hạng ${row.position}.` })
    if (seenTeams.has(teamKey)) errors.push({ rowNumber: row.rowNumber, message: `Đội "${row.team}" xuất hiện 2 lần.` })
    seenPositions.add(row.position)
    seenTeams.add(teamKey)
  }

  return { ...meta, rows, errors }
}

/** File mẫu: 3 ô thông tin phía trên + hàng tiêu đề + 1 dòng ví dụ. */
export async function buildStandingsTemplate(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Bảng xếp hạng')
  const columns = COLUMNS.filter((col) => col.width > 0)

  sheet.addRow(['Giải đấu', 'V.League 1'])
  sheet.addRow(['Mùa giải', '2026/27'])
  sheet.addRow(['Cập nhật sau vòng', 8])
  sheet.addRow([])
  sheet.addRow(columns.map((col) => col.header)).font = { bold: true }
  sheet.addRow(columns.map((col) => col.example ?? ''))

  columns.forEach((col, index) => {
    sheet.getColumn(index + 1).width = col.width
  })
  // Cột A còn chứa nhãn "Cập nhật sau vòng" nên cần rộng hơn
  sheet.getColumn(1).width = 20
  for (let rowNumber = 1; rowNumber <= 3; rowNumber++) sheet.getRow(rowNumber).getCell(1).font = { bold: true }

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
