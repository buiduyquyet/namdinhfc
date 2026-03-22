export type MatchStatus = "upcoming" | "live" | "finished";
export type Competition = "V.League 1" | "Cúp Quốc Gia" | "AFC Champions League Two";

export interface Match {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    date: string;
    time: string;
    venue: string;
    competition: Competition;
    status: MatchStatus;
    matchday?: number;
    isHomeGame: boolean;
}

export const TEAM_NAME = "Thép Xanh Nam Định";

export const matches: Match[] = [
    // Upcoming matches
    {
        id: "m-01",
        homeTeam: TEAM_NAME,
        awayTeam: "Hà Nội FC",
        date: "2026-03-22",
        time: "19:15",
        venue: "Sân Thiên Trường",
        competition: "V.League 1",
        status: "upcoming",
        matchday: 10,
        isHomeGame: true,
    },
    {
        id: "m-02",
        homeTeam: "Hải Phòng FC",
        awayTeam: TEAM_NAME,
        date: "2026-03-29",
        time: "17:00",
        venue: "Sân Lạch Tray",
        competition: "V.League 1",
        status: "upcoming",
        matchday: 11,
        isHomeGame: false,
    },
    {
        id: "m-03",
        homeTeam: TEAM_NAME,
        awayTeam: "Becamex Bình Dương",
        date: "2026-04-05",
        time: "19:15",
        venue: "Sân Thiên Trường",
        competition: "V.League 1",
        status: "upcoming",
        matchday: 12,
        isHomeGame: true,
    },
    {
        id: "m-04",
        homeTeam: "Công An Hà Nội",
        awayTeam: TEAM_NAME,
        date: "2026-04-12",
        time: "19:15",
        venue: "Sân Hàng Đẫy",
        competition: "V.League 1",
        status: "upcoming",
        matchday: 13,
        isHomeGame: false,
    },

    // Finished matches
    {
        id: "m-05",
        homeTeam: TEAM_NAME,
        awayTeam: "SHB Đà Nẵng",
        homeScore: 3,
        awayScore: 1,
        date: "2026-03-15",
        time: "19:15",
        venue: "Sân Thiên Trường",
        competition: "V.League 1",
        status: "finished",
        matchday: 9,
        isHomeGame: true,
    },
    {
        id: "m-06",
        homeTeam: "Thanh Hoá FC",
        awayTeam: TEAM_NAME,
        homeScore: 0,
        awayScore: 2,
        date: "2026-03-08",
        time: "17:00",
        venue: "Sân Thanh Hoá",
        competition: "V.League 1",
        status: "finished",
        matchday: 8,
        isHomeGame: false,
    },
    {
        id: "m-07",
        homeTeam: TEAM_NAME,
        awayTeam: "Hoàng Anh Gia Lai",
        homeScore: 2,
        awayScore: 0,
        date: "2026-03-01",
        time: "19:15",
        venue: "Sân Thiên Trường",
        competition: "V.League 1",
        status: "finished",
        matchday: 7,
        isHomeGame: true,
    },
    {
        id: "m-08",
        homeTeam: "Viettel FC",
        awayTeam: TEAM_NAME,
        homeScore: 1,
        awayScore: 1,
        date: "2026-02-22",
        time: "19:15",
        venue: "Sân Hàng Đẫy",
        competition: "V.League 1",
        status: "finished",
        matchday: 6,
        isHomeGame: false,
    },
    {
        id: "m-09",
        homeTeam: TEAM_NAME,
        awayTeam: "TP. Hồ Chí Minh FC",
        homeScore: 4,
        awayScore: 0,
        date: "2026-02-15",
        time: "19:15",
        venue: "Sân Thiên Trường",
        competition: "V.League 1",
        status: "finished",
        matchday: 5,
        isHomeGame: true,
    },
];

export const upcomingMatches = matches
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export const finishedMatches = matches
    .filter((m) => m.status === "finished")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const nextMatch = upcomingMatches[0];
