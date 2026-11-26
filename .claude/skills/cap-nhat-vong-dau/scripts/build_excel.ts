/**
 * Từ JSON của `parse_vpf.py` → 2 file Excel đúng mẫu import trong admin:
 *   - bxh-vleague-<mùa>-sau-vong-<N>.xlsx         → Bảng xếp hạng → Import từ Excel
 *   - tran-dau-nam-dinh-<mùa>-sau-vong-<N>.xlsx   → Trận đấu → Import từ Excel
 * Sau khi ghi, đọc lại bằng chính parser của web để chắc chắn import được.
 *
 * Chạy từ thư mục gốc dự án:
 *   npx tsx --tsconfig tsconfig.json .claude/skills/cap-nhat-vong-dau/scripts/build_excel.ts <data.json> <thư mục ra>
 */
import { readFileSync } from 'fs'
import path from 'path'
import ExcelJS from 'exceljs'

import { parseMatchesWorkbook } from '@/lib/excel-matches'
import { parseStandingsWorkbook } from '@/lib/excel-standings'

interface StandingRow {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
  form: string
}

interface VpfMatch {
  matchday: number
  date: string | null
  time: string | null
  venue: string
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
}

interface VpfData {
  season: string
  latestMatchday: number
  standings: StandingRow[]
  teamMatches: VpfMatch[]
}

const toArrayBuffer = (buffer: Buffer) =>
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer

/** "2026-11-21" → "21/11/2026" (dạng người dùng hay gõ, parser của web nhận được) */
const toViDate = (iso: string) => iso.split('-').reverse().join('/')

/** Admin đang ghi "Sân vận động …", VPF ghi tắt "SVĐ …" */
const expandVenue = (venue: string) => venue.replace(/^SVĐ\b/, 'Sân vận động')

async function buildStandings(data: VpfData, file: string) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Bảng xếp hạng')

  sheet.addRow(['Giải đấu', 'V.League 1'])
  sheet.addRow(['Mùa giải', data.season])
  sheet.addRow(['Cập nhật sau vòng', data.latestMatchday])
  sheet.addRow([])
  sheet.addRow(['Hạng', 'Tên đội', 'Số trận', 'Thắng', 'Hòa', 'Thua', 'Bàn thắng', 'Bàn thua', 'Điểm', 'Phong độ']).font = {
    bold: true,
  }
  data.standings.forEach((row) =>
    sheet.addRow([
      row.position,
      row.team,
      row.played,
      row.won,
      row.drawn,
      row.lost,
      row.goalsFor,
      row.goalsAgainst,
      row.points,
      row.form,
    ]),
  )
  ;[20, 30, 10, 9, 9, 9, 11, 11, 9, 12].forEach((width, index) => {
    sheet.getColumn(index + 1).width = width
  })
  for (let rowNumber = 1; rowNumber <= 3; rowNumber++) sheet.getRow(rowNumber).getCell(1).font = { bold: true }

  await workbook.xlsx.writeFile(file)
  return parseStandingsWorkbook(toArrayBuffer(readFileSync(file)))
}

async function buildMatches(data: VpfData, file: string) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Trận đấu')

  sheet.addRow(['Vòng', 'Ngày', 'Giờ', 'Đội nhà', 'Đội khách', 'Bàn đội nhà', 'Bàn đội khách', 'Sân', 'Giải đấu']).font = {
    bold: true,
  }

  // Trận VPF chưa chốt ngày thì bỏ qua — import cần ngày để tạo trận
  const dated = data.teamMatches
    .filter((match): match is VpfMatch & { date: string } => match.date !== null)
    .sort((a, b) => a.date.localeCompare(b.date))

  dated.forEach((match) =>
    sheet.addRow([
      match.matchday,
      toViDate(match.date),
      match.time ?? '',
      match.home,
      match.away,
      match.homeScore ?? '',
      match.awayScore ?? '',
      expandVenue(match.venue),
      'V.League 1',
    ]),
  )
  ;[8, 13, 8, 26, 26, 12, 13, 30, 12].forEach((width, index) => {
    sheet.getColumn(index + 1).width = width
  })

  await workbook.xlsx.writeFile(file)
  return parseMatchesWorkbook(toArrayBuffer(readFileSync(file)))
}

async function main() {
  const [jsonPath, outDir] = process.argv.slice(2)
  if (!jsonPath || !outDir) {
    console.error('Cách dùng: build_excel.ts <data.json> <thư mục ra>')
    process.exit(1)
  }

  const data = JSON.parse(readFileSync(jsonPath, 'utf8')) as VpfData
  const seasonSlug = data.season.replace('/', '-')
  const suffix = `${seasonSlug}-sau-vong-${data.latestMatchday}.xlsx`

  const standingsFile = path.join(outDir, `bxh-vleague-${suffix}`)
  const matchesFile = path.join(outDir, `tran-dau-nam-dinh-${suffix}`)

  const standings = await buildStandings(data, standingsFile)
  const matches = await buildMatches(data, matchesFile)

  console.log(`BXH:      ${standingsFile}`)
  console.log(`          đọc lại: ${standings.rows.length} đội, mùa ${standings.season}, sau vòng ${standings.matchday}, lỗi ${standings.errors.length}`)
  console.log(`Trận đấu: ${matchesFile}`)
  console.log(`          đọc lại: ${matches.rows.length} trận, lỗi ${matches.errors.length}`)

  const errors = [...standings.errors, ...matches.errors]
  if (errors.length) {
    console.error('File chưa import được:', JSON.stringify(errors, null, 2))
    process.exit(2)
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
