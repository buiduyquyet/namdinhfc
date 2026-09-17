export type MatchResult = "W" | "D" | "L";

export interface LeagueTableEntry {
  position: number;
  team: string;
  shortName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number; // Goals For
  ga: number; // Goals Against
  gd: number; // Goal Difference
  points: number;
  /** Kết quả gần nhất, cũ → mới. */
  form: MatchResult[];
}

export interface LeagueStandings {
  competition: string;
  season: string;
  /** Bảng được cập nhật sau vòng đấu này. */
  matchday?: number;
  entries: LeagueTableEntry[];
}

export const TEAM_NAME = "Thép Xanh Nam Định";

type Row = [string, string, number, number, number, number, number, number, MatchResult[]];

/**
 * Snapshot V.League 1 2026/27 sau vòng 2 (13/09/2026), nguồn VPF.
 * Chỉ dùng làm fallback khi không gọi được Payload — dữ liệu chính do admin cập nhật
 * trong collection "Bảng xếp hạng".
 */
const rows: Row[] = [
  // team, shortName, W, D, L, GF, GA, points, form
  ["Ninh Bình", "Ninh Bình", 2, 0, 0, 6, 2, 6, ["W", "W"]],
  ["Sông Lam Nghệ An", "SLNA", 2, 0, 0, 5, 1, 6, ["W", "W"]],
  ["Công An Hà Nội", "CAHN", 2, 0, 0, 3, 0, 6, ["W", "W"]],
  ["SHB Đà Nẵng", "Đà Nẵng", 1, 0, 1, 5, 3, 3, ["L", "W"]],
  [TEAM_NAME, "Nam Định", 1, 0, 1, 4, 3, 3, ["W", "L"]],
  ["Công An TP.HCM", "CA TP.HCM", 1, 0, 1, 3, 2, 3, ["W", "L"]],
  ["Thể Công - Viettel", "Viettel", 1, 0, 1, 2, 1, 3, ["W", "L"]],
  ["Thanh Hóa", "Thanh Hóa", 1, 0, 1, 4, 4, 3, ["W", "L"]],
  ["Bắc Ninh", "Bắc Ninh", 1, 0, 1, 1, 1, 3, ["L", "W"]],
  ["Hải Phòng", "Hải Phòng", 1, 0, 1, 4, 5, 3, ["L", "W"]],
  ["Hồng Lĩnh Hà Tĩnh", "Hà Tĩnh", 1, 0, 1, 1, 2, 3, ["L", "W"]],
  ["Thành phố Đồng Nai", "Đồng Nai", 0, 0, 2, 0, 3, 0, ["L", "L"]],
  ["Hà Nội FC", "Hà Nội", 0, 0, 2, 2, 7, 0, ["L", "L"]],
  ["Hoàng Anh Gia Lai", "HAGL", 0, 0, 2, 1, 7, 0, ["L", "L"]],
];

export const leagueStandings: LeagueStandings = {
  competition: "V.League 1",
  season: "2026/27",
  matchday: 2,
  entries: rows.map(([team, shortName, won, drawn, lost, gf, ga, points, form], index) => ({
    position: index + 1,
    team,
    shortName,
    played: won + drawn + lost,
    won,
    drawn,
    lost,
    gf,
    ga,
    gd: gf - ga,
    points,
    form,
  })),
};
