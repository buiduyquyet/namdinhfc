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
  form: ("W" | "D" | "L")[];
}

export const TEAM_NAME = "Thép Xanh Nam Định";

export const leagueTable: LeagueTableEntry[] = [
  {
    position: 1,
    team: "Thép Xanh Nam Định",
    shortName: "Nam Định",
    played: 9,
    won: 7,
    drawn: 1,
    lost: 1,
    gf: 21,
    ga: 6,
    gd: 15,
    points: 22,
    form: ["W", "W", "W", "W", "W"],
  },
  {
    position: 2,
    team: "Công An Hà Nội",
    shortName: "CAHN",
    played: 9,
    won: 6,
    drawn: 2,
    lost: 1,
    gf: 18,
    ga: 8,
    gd: 10,
    points: 20,
    form: ["W", "D", "W", "W", "L"],
  },
  {
    position: 3,
    team: "Hà Nội FC",
    shortName: "Hà Nội",
    played: 9,
    won: 5,
    drawn: 3,
    lost: 1,
    gf: 16,
    ga: 9,
    gd: 7,
    points: 18,
    form: ["D", "W", "W", "D", "W"],
  },
  {
    position: 4,
    team: "Thanh Hóa",
    shortName: "Thanh Hóa",
    played: 9,
    won: 5,
    drawn: 1,
    lost: 3,
    gf: 14,
    ga: 11,
    gd: 3,
    points: 16,
    form: ["L", "W", "L", "W", "W"],
  },
  {
    position: 5,
    team: "Viettel FC",
    shortName: "Viettel",
    played: 9,
    won: 4,
    drawn: 3,
    lost: 2,
    gf: 12,
    ga: 10,
    gd: 2,
    points: 15,
    form: ["D", "D", "W", "L", "W"],
  },
  {
    position: 6,
    team: "Hải Phòng",
    shortName: "Hải Phòng",
    played: 9,
    won: 4,
    drawn: 2,
    lost: 3,
    gf: 13,
    ga: 12,
    gd: 1,
    points: 14,
    form: ["W", "L", "D", "W", "L"],
  },
  {
    position: 7,
    team: "Hoàng Anh Gia Lai",
    shortName: "HAGL",
    played: 9,
    won: 3,
    drawn: 3,
    lost: 3,
    gf: 11,
    ga: 13,
    gd: -2,
    points: 12,
    form: ["L", "W", "D", "L", "W"],
  },
  {
    position: 8,
    team: "Becamex Bình Dương",
    shortName: "Bình Dương",
    played: 9,
    won: 3,
    drawn: 2,
    lost: 4,
    gf: 10,
    ga: 14,
    gd: -4,
    points: 11,
    form: ["W", "L", "L", "W", "D"],
  },
];

// Helper để lấy top N đội
export const getTopTeams = (n: number = 5) => leagueTable.slice(0, n);

// Helper để lấy vị trí của Nam Định
export const getNamDinhPosition = () =>
  leagueTable.find((t) => t.team === TEAM_NAME);
