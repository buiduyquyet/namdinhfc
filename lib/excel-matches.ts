import ExcelJS from 'exceljs'

import type { Competition } from '@/data/matches'
import { COMPETITION_OPTIONS } from '@/lib/competition'
import { cellToString, type RowError } from '@/lib/excel-clubs'
import { vietnamTimeToISO } from '@/lib/format-date'
import { normalizeText } from '@/lib/normalize-text'

/** Một dòng Excel đã chuẩn hoá thành 1 trận đấu. Ô trống = `undefined` = giữ giá trị cũ trong CMS. */
export interface ParsedMatchRow {
  rowNumber: number
  /** ISO UTC, đã quy đổi từ giờ Việt Nam. */
  date: string
  homeTeam: string
  awayTeam: string
  competition: Competition
  matchday?: number
  homeScore?: number
  awayScore?: number
  stadium?: string
  ticketUrl?: string
  highlightUrl?: string
}

export interface ParsedMatches {
  rows: ParsedMatchRow[]
  errors: RowError[]
}

/** So khớp tiêu đề "dễ dãi": bỏ dấu, hoa thường và khoảng trắng. */
const headerKey = (value: string) => normalizeText(value).replace(/\s+/g, '')

const COLUMNS = [
  { key: 'matchday', header: 'Vòng', width: 8, aliases: ['vong dau', 'matchday', 'round'], example: 8 },
  { key: 'date', header: 'Ngày', width: 13, aliases: ['ngay thi dau', 'ngay da', 'date'], example: '21/11/2026' },
  { key: 'time', header: 'Giờ', width: 8, aliases: ['gio thi dau', 'gio da', 'time'], example: '18:00' },
  { key: 'homeTeam', header: 'Đội nhà', width: 26, aliases: ['doi chu nha', 'home', 'home team'], example: 'Thép Xanh Nam Định' },
  { key: 'awayTeam', header: 'Đội khách', width: 26, aliases: ['away', 'away team'], example: 'Hải Phòng' },
  { key: 'homeScore', header: 'Bàn đội nhà', width: 12, aliases: ['ban thang doi nha', 'home score'], example: 2 },
  { key: 'awayScore', header: 'Bàn đội khách', width: 13, aliases: ['ban thang doi khach', 'away score'], example: 1 },
  /** Cột gộp "2 - 1". Chỉ dùng khi file không có 2 cột tách riêng. */
  { key: 'score', header: 'Tỉ số', width: 0, aliases: ['ty so', 'score', 'ket qua'], example: undefined },
  { key: 'stadium', header: 'Sân', width: 26, aliases: ['san van dong', 'svd', 'venue', 'stadium'], example: 'Sân vận động Thiên Trường' },
  { key: 'competition', header: 'Giải đấu', width: 14, aliases: ['giai', 'competition'], example: 'V.League 1' },
  { key: 'ticketUrl', header: 'Link mua vé', width: 24, aliases: ['link ve', 'ticket'], example: undefined },
  { key: 'highlightUrl', header: 'Link highlight', width: 24, aliases: ['highlight'], example: undefined },
] as const

type ColumnKey = (typeof COLUMNS)[number]['key']

function findColumn(text: string): ColumnKey | undefined {
  const key = headerKey(text)
  return COLUMNS.find(
    (col) => headerKey(col.header) === key || col.aliases.some((alias) => headerKey(alias) === key),
  )?.key
}

function mapHeaderColumns(sheet: ExcelJS.Worksheet) {
  for (let rowNumber = 1; rowNumber <= Math.min(sheet.rowCount, 10); rowNumber++) {
    const columnIndexes: Partial<Record<ColumnKey, number>> = {}

    sheet.getRow(rowNumber).eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const column = findColumn(cellToString(cell))
      if (column && columnIndexes[column] === undefined) columnIndexes[column] = colNumber
    })

    const { date, homeTeam, awayTeam } = columnIndexes
    if (date !== undefined && homeTeam !== undefined && awayTeam !== undefined) {
      return { headerRow: rowNumber, columnIndexes }
    }
  }
  return null
}

/**
 * Ô ngày → `YYYY-MM-DD`. Nhận ô Date của Excel (ExcelJS trả về Date ở UTC đúng
 * ngày hiển thị) lẫn chuỗi `dd/MM/yyyy` hoặc `yyyy-MM-dd`.
 */
function parseDateCell(cell: ExcelJS.Cell | undefined): string | null {
  const raw = cell?.value
  if (raw instanceof Date) return toDateString(raw.getUTCFullYear(), raw.getUTCMonth() + 1, raw.getUTCDate())

  const text = cellToString(cell)
  const vi = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  if (vi) return toDateString(Number(vi[3]), Number(vi[2]), Number(vi[1]))
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return toDateString(Number(iso[1]), Number(iso[2]), Number(iso[3]))
  return null
}

/** `YYYY-MM-DD`, hoặc `null` với ngày không tồn tại như 31/02 (JS sẽ tự lùi sang 03/03). */
function toDateString(year: number, month: number, day: number): string | null {
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return date.toISOString().slice(0, 10)
}

/** Ô giờ → `HH:mm`. Nhận ô Time của Excel (Date hoặc phân số của ngày) lẫn chuỗi "18:00" / "18h00". */
function parseTimeCell(cell: ExcelJS.Cell | undefined): string | null {
  const raw = cell?.value
  const pad = (value: number) => String(value).padStart(2, '0')

  if (raw instanceof Date) return `${pad(raw.getUTCHours())}:${pad(raw.getUTCMinutes())}`
  if (typeof raw === 'number' && raw >= 0 && raw < 1) {
    const minutes = Math.round(raw * 24 * 60)
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
  }

  const match = cellToString(cell).match(/^(\d{1,2})\s*[:hH]\s*(\d{2})?$/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2] ?? 0)
  return hours < 24 && minutes < 60 ? `${pad(hours)}:${pad(minutes)}` : null
}

/** Ô số bàn thắng: trống → `undefined`, sai → message lỗi. */
function parseGoals(raw: string, label: string): number | undefined | string {
  if (!raw) return undefined
  return /^\d+$/.test(raw) ? Number(raw) : `Cột "${label}" phải là số (đang là "${raw}").`
}

const toUrl = (raw: string) => (/^https?:\/\/\S+$/i.test(raw) ? raw : undefined)

/** Đọc sheet đầu tiên thành danh sách trận. Dòng lỗi gom vào `errors`, các dòng khác vẫn import. */
export async function parseMatchesWorkbook(buffer: ArrayBuffer): Promise<ParsedMatches> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)

  const sheet = workbook.worksheets[0]
  if (!sheet) throw new Error('File Excel không có sheet nào.')

  const header = mapHeaderColumns(sheet)
  if (!header) throw new Error('Không tìm thấy hàng tiêu đề. File cần có cột "Ngày", "Đội nhà", "Đội khách" — hãy tải file mẫu.')

  const { headerRow, columnIndexes } = header
  const rows: ParsedMatchRow[] = []
  const errors: RowError[] = []

  for (let rowNumber = headerRow + 1; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber)
    const cellAt = (key: ColumnKey) => {
      const index = columnIndexes[key]
      return index === undefined ? undefined : row.getCell(index)
    }
    const text = (key: ColumnKey) => cellToString(cellAt(key))

    const homeTeam = text('homeTeam')
    const awayTeam = text('awayTeam')
    if (!homeTeam && !awayTeam && !text('date')) continue // dòng trống

    const messages: string[] = []
    if (!homeTeam || !awayTeam) messages.push('Thiếu đội nhà hoặc đội khách.')

    const date = parseDateCell(cellAt('date'))
    if (!date) messages.push(`Ngày "${text('date')}" không hợp lệ (dạng 21/11/2026).`)

    // Không có cột / ô giờ trống thì coi như chưa chốt giờ
    const time = text('time') ? parseTimeCell(cellAt('time')) : '00:00'
    if (!time) messages.push(`Giờ "${text('time')}" không hợp lệ (dạng 18:00).`)

    const rawCompetition = text('competition')
    const competition = rawCompetition
      ? COMPETITION_OPTIONS.find((option) => normalizeText(option.value) === normalizeText(rawCompetition))?.value
      : 'V.League 1'
    if (!competition) messages.push(`Không nhận ra giải đấu "${rawCompetition}".`)

    const rawMatchday = text('matchday')
    const matchday = rawMatchday ? Number(rawMatchday) : undefined
    if (matchday !== undefined && !(Number.isInteger(matchday) && matchday > 0)) {
      messages.push(`Vòng "${rawMatchday}" không hợp lệ.`)
    }

    // Tỉ số: 2 cột tách riêng, hoặc cột gộp "2 - 1"
    const combined = text('score').match(/^(\d+)\s*-\s*(\d+)$/)
    if (text('score') && !combined) messages.push(`Tỉ số "${text('score')}" phải có dạng 2 - 1.`)
    const homeScore = combined ? Number(combined[1]) : parseGoals(text('homeScore'), 'Bàn đội nhà')
    const awayScore = combined ? Number(combined[2]) : parseGoals(text('awayScore'), 'Bàn đội khách')
    if (typeof homeScore === 'string') messages.push(homeScore)
    if (typeof awayScore === 'string') messages.push(awayScore)
    if ((homeScore === undefined) !== (awayScore === undefined)) messages.push('Tỉ số phải điền đủ cả 2 đội.')

    const iso = date && time ? vietnamTimeToISO(date, time) : null
    if (messages.length || !iso || !competition) {
      errors.push({ rowNumber, message: messages.join(' ') || 'Ngày giờ không hợp lệ.' })
      continue
    }

    rows.push({
      rowNumber,
      date: iso,
      homeTeam,
      awayTeam,
      competition,
      matchday,
      homeScore: homeScore as number | undefined,
      awayScore: awayScore as number | undefined,
      stadium: text('stadium') || undefined,
      ticketUrl: toUrl(text('ticketUrl')),
      highlightUrl: toUrl(text('highlightUrl')),
    })
  }

  return { rows, errors }
}

/** File mẫu: hàng tiêu đề + 1 dòng ví dụ. */
export async function buildMatchesTemplate(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Trận đấu')
  const columns = COLUMNS.filter((col) => col.width > 0)

  sheet.columns = columns.map((col) => ({ header: col.header, key: col.key, width: col.width }))
  sheet.getRow(1).font = { bold: true }
  sheet.addRow(Object.fromEntries(columns.map((col) => [col.key, col.example ?? ''])))

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
