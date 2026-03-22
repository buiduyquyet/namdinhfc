export type Position = "goalkeeper" | "defender" | "midfielder" | "forward";

export interface Player {
    id: string;
    name: string;
    slug: string;
    number: number;
    position: Position;
    nationality: string;
    age: number;
    image?: string;
    isFeatured?: boolean;
    stats?: {
        appearances: number;
        goals: number;
        assists: number;
    };
    bio?: string;
}

export const positionLabels: Record<Position, string> = {
    goalkeeper: "Thủ môn",
    defender: "Hậu vệ",
    midfielder: "Tiền vệ",
    forward: "Tiền đạo",
};

export const players: Player[] = [
    // Goalkeepers
    {
        id: "gk-01",
        name: "Trần Nguyên Mạnh",
        slug: "tran-nguyen-manh",
        number: 1,
        position: "goalkeeper",
        nationality: "Việt Nam",
        age: 33,
        isFeatured: true,
        stats: { appearances: 28, goals: 0, assists: 0 },
        bio: "Thủ môn số 1 của CLB và ĐTQG Việt Nam, nổi tiếng với những pha cứu thua xuất sắc.",
    },
    {
        id: "gk-02",
        name: "Trần Liêm Điều",
        slug: "tran-liem-dieu",
        number: 25,
        position: "goalkeeper",
        nationality: "Việt Nam",
        age: 27,
        stats: { appearances: 8, goals: 0, assists: 0 },
    },
    {
        id: "gk-03",
        name: "Lê Vũ Phong",
        slug: "le-vu-phong",
        number: 33,
        position: "goalkeeper",
        nationality: "Việt Nam",
        age: 22,
        stats: { appearances: 2, goals: 0, assists: 0 },
    },

    // Defenders
    {
        id: "df-01",
        name: "Nguyễn Phong Hồng Duy",
        slug: "nguyen-phong-hong-duy",
        number: 2,
        position: "defender",
        nationality: "Việt Nam",
        age: 30,
        stats: { appearances: 24, goals: 1, assists: 3 },
    },
    {
        id: "df-02",
        name: "Trần Văn Kiên",
        slug: "tran-van-kien",
        number: 3,
        position: "defender",
        nationality: "Việt Nam",
        age: 29,
        stats: { appearances: 22, goals: 0, assists: 2 },
    },
    {
        id: "df-03",
        name: "Đặng Văn Tới",
        slug: "dang-van-toi",
        number: 4,
        position: "defender",
        nationality: "Việt Nam",
        age: 28,
        stats: { appearances: 26, goals: 2, assists: 1 },
    },
    {
        id: "df-04",
        name: "Walber",
        slug: "walber",
        number: 5,
        position: "defender",
        nationality: "Brazil",
        age: 29,
        stats: { appearances: 25, goals: 3, assists: 0 },
    },
    {
        id: "df-05",
        name: "Nguyễn Văn Vĩ",
        slug: "nguyen-van-vi",
        number: 15,
        position: "defender",
        nationality: "Việt Nam",
        age: 26,
        stats: { appearances: 18, goals: 0, assists: 1 },
    },
    {
        id: "df-06",
        name: "Lucas Alves",
        slug: "lucas-alves",
        number: 44,
        position: "defender",
        nationality: "Brazil",
        age: 28,
        stats: { appearances: 20, goals: 1, assists: 0 },
    },

    // Midfielders
    {
        id: "mf-01",
        name: "Nguyễn Tuấn Anh",
        slug: "nguyen-tuan-anh",
        number: 8,
        position: "midfielder",
        nationality: "Việt Nam",
        age: 31,
        isFeatured: true,
        stats: { appearances: 22, goals: 3, assists: 7 },
        bio: "Tiền vệ tài hoa, được mệnh danh là 'phù thuỷ' của bóng đá Việt Nam với kỹ thuật điêu luyện.",
    },
    {
        id: "mf-02",
        name: "Caio Cesar",
        slug: "caio-cesar",
        number: 10,
        position: "midfielder",
        nationality: "Brazil",
        age: 27,
        isFeatured: true,
        stats: { appearances: 26, goals: 5, assists: 9 },
        bio: "Tiền vệ sáng tạo người Brazil, trụ cột tuyến giữa với khả năng kiến tạo xuất sắc.",
    },
    {
        id: "mf-03",
        name: "Rômulo",
        slug: "romulo",
        number: 20,
        position: "midfielder",
        nationality: "Brazil",
        age: 28,
        stats: { appearances: 24, goals: 4, assists: 3 },
    },
    {
        id: "mf-04",
        name: "Lý Công Hoàng Anh",
        slug: "ly-cong-hoang-anh",
        number: 14,
        position: "midfielder",
        nationality: "Việt Nam",
        age: 25,
        stats: { appearances: 20, goals: 2, assists: 4 },
    },
    {
        id: "mf-05",
        name: "Trần Văn Công",
        slug: "tran-van-cong",
        number: 16,
        position: "midfielder",
        nationality: "Việt Nam",
        age: 27,
        stats: { appearances: 18, goals: 1, assists: 2 },
    },
    {
        id: "mf-06",
        name: "Mpande Joseph Mbolimbo",
        slug: "mpande-joseph",
        number: 6,
        position: "midfielder",
        nationality: "Congo",
        age: 26,
        stats: { appearances: 22, goals: 2, assists: 3 },
    },
    {
        id: "mf-07",
        name: "Dương Thanh Hào",
        slug: "duong-thanh-hao",
        number: 17,
        position: "midfielder",
        nationality: "Việt Nam",
        age: 24,
        stats: { appearances: 15, goals: 1, assists: 2 },
    },
    {
        id: "mf-08",
        name: "Tô Văn Vũ",
        slug: "to-van-vu",
        number: 22,
        position: "midfielder",
        nationality: "Việt Nam",
        age: 23,
        stats: { appearances: 12, goals: 0, assists: 1 },
    },

    // Forwards
    {
        id: "fw-01",
        name: "Rafaelson",
        slug: "rafaelson",
        number: 9,
        position: "forward",
        nationality: "Brazil",
        age: 30,
        isFeatured: true,
        stats: { appearances: 26, goals: 22, assists: 5 },
        bio: "Chân sút số 1 của đội, Vua phá lưới V.League với bản năng ghi bàn vượt trội.",
    },
    {
        id: "fw-02",
        name: "Brenner Marlos",
        slug: "brenner-marlos",
        number: 11,
        position: "forward",
        nationality: "Brazil",
        age: 27,
        isFeatured: true,
        stats: { appearances: 24, goals: 12, assists: 6 },
        bio: "Tiền đạo tốc độ với khả năng đi bóng và dứt điểm sắc bén.",
    },
    {
        id: "fw-03",
        name: "Nguyễn Văn Toàn",
        slug: "nguyen-van-toan",
        number: 7,
        position: "forward",
        nationality: "Việt Nam",
        age: 30,
        stats: { appearances: 20, goals: 6, assists: 4 },
    },
    {
        id: "fw-04",
        name: "Lâm Ti Phông",
        slug: "lam-ti-phong",
        number: 19,
        position: "forward",
        nationality: "Việt Nam",
        age: 24,
        stats: { appearances: 16, goals: 4, assists: 2 },
    },
];

export const featuredPlayers = players.filter((p) => p.isFeatured);
