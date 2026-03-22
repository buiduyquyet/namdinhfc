import SectionTitle from "@/components/SectionTitle";
import StatsCounter from "@/components/StatsCounter";
import { clubStats } from "@/data/club-info";
import SectionBackground from "./SectionBackground";
import SectionDark from "../SectionDark";

const statsItems = [
  { value: clubStats.titles, label: "Danh hiệu VĐQG" },
  { value: clubStats.nationalCup, label: "Cúp quốc gia" },
  { value: clubStats.superCup, label: "Siêu cúp quốc gia" },
  {
    value: clubStats.stadiumCapacity,
    label: "Sức chứa sân",
    suffix: "+",
  },
  {
    value: clubStats.fans,
    label: "Ngưởi hâm mộ",
    suffix: "+",
  },
];

export default function StatsSection() {
  return (
    <SectionDark
      title="Con Số Ấn Tượng"
      subtitle="Gần 60 năm xây dựng và phát triển cùng bóng đá Việt Nam"
      chidlren={<StatsCounter items={statsItems} />}
    />
  );
}
