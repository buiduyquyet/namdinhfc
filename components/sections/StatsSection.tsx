import StatsCounter from "@/components/StatsCounter";
import { clubStats } from "@/data/club-info";
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
    label: "Người hâm mộ",
    suffix: "+",
  },
];

const StatsSection = () => {
  return (
    <SectionDark
      title="Dấu ấn thành Nam"
      subtitle="Hành trình gắn bó cùng bóng đá Việt Nam từ năm 1965."
    >
      <StatsCounter items={statsItems} />
    </SectionDark>
  );
};

export default StatsSection;
