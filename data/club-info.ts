export interface ClubInfo {
  name: string;
  fullName: string;
  nickname: string[];
  founded: number;
  stadium: string;
  stadiumCapacity: number;
  owner: string;
  chairman: string;
  headCoach: string;
  league: string;
  facebook: string;
  address: string;
  phone: string;
  email: string;
}

export interface Achievement {
  year: string;
  title: string;
  description: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  type: "founding" | "championship" | "milestone" | "relegation" | "promotion";
}

export interface LeadershipMember {
  name: string;
  role: string;
  image?: string;
}

export const clubInfo: ClubInfo = {
  name: "Thép Xanh Nam Định FC",
  fullName: "Câu lạc bộ Bóng đá Thép Xanh Nam Định",
  nickname: ["Đội bóng thành Nam", "Hào khí Đông A"],
  founded: 1965,
  stadium: "Sân vận động Thiên Trường",
  stadiumCapacity: 30000,
  owner: "Xuân Thiện Group",
  chairman: "Vũ Cảnh Tuân",
  headCoach: "Vũ Hồng Việt",
  league: "V.League 1",
  facebook: "https://www.facebook.com/ThepXanhNamDinhFC",
  address: "Sân vận động Thiên Trường, Đường Trần Phú, TP. Nam Định, Tỉnh Nam Định",
  phone: "(0228) 3849 888",
  email: "contact@thepxanhnamdinh.vn",
};

export const achievements: Achievement[] = [
  {
    year: "2024-25",
    title: "Vô địch V.League 1",
    description: "Bảo vệ thành công ngôi vương V.League lần thứ 2 liên tiếp",
  },
  {
    year: "2023-24",
    title: "Vô địch V.League 1",
    description: "Lần đầu tiên giành chức vô địch V.League sau gần 40 năm",
  },
  {
    year: "2025-26",
    title: "AFC Champions League Two",
    description: "Tham dự vòng bảng AFC Champions League Two",
  },
  {
    year: "1985",
    title: "Vô địch Quốc gia",
    description: "Giành chức vô địch giải VĐQG dưới tên Công nghiệp Hà Nam Ninh",
  },
];

export const timeline: TimelineEvent[] = [
  {
    year: 1965,
    title: "Thành lập đội bóng",
    description: "Đội bóng được thành lập tại tỉnh Nam Định, mang tên Thanh niên Nam Hà.",
    type: "founding",
  },
  {
    year: 1985,
    title: "Vô địch Quốc gia lần đầu",
    description:
      "Với tên gọi Công nghiệp Hà Nam Ninh, đội giành chức vô địch giải Vô địch bóng đá Việt Nam.",
    type: "championship",
  },
  {
    year: 2003,
    title: "Khánh thành sân Thiên Trường",
    description:
      'Sân vận động Thiên Trường được khánh thành phục vụ SEA Games 22, trở thành "chảo lửa" huyền thoại.',
    type: "milestone",
  },
  {
    year: 2017,
    title: "Trở lại V.League",
    description:
      "Sau nhiều năm thăng trầm, Nam Định chính thức thăng hạng trở lại V.League 1.",
    type: "promotion",
  },
  {
    year: 2024,
    title: "Vô địch V.League 2023-24",
    description:
      "Thép Xanh Nam Định lần đầu vô địch V.League sau gần 40 năm chờ đợi, ghi dấu ấn lịch sử.",
    type: "championship",
  },
  {
    year: 2025,
    title: "2 lần liên tiếp Vô địch V.League",
    description:
      "Bảo vệ thành công ngôi vương V.League 2024-25 và tham dự AFC Champions League Two.",
    type: "championship",
  },
];

export const leadership: LeadershipMember[] = [
  {
    name: "Vũ Cảnh Tuân",
    role: "Chủ tịch điều hành",
  },
  {
    name: "Vũ Hồng Việt",
    role: "Huấn luyện viên trưởng",
  },
];

export const clubStats = {
  founded: 1965,
  titles: 3,
  nationalCup: 1,
  superCup: 1,
  stadiumCapacity: 30000,
  fans: 165000,
};
