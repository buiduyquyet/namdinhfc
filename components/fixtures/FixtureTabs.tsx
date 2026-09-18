export type FixtureTab = "upcoming" | "results" | "standings";

export const FIXTURE_TABS: { label: string; value: FixtureTab }[] = [
  { label: "Lịch Thi Đấu", value: "upcoming" },
  { label: "Kết Quả", value: "results" },
  { label: "Bảng Xếp Hạng", value: "standings" },
];

/** Chuỗi bất kỳ (thường từ query string) → tab hợp lệ, mặc định "Lịch thi đấu". */
export function parseFixtureTab(value?: string): FixtureTab {
  return value === "results" || value === "standings" ? value : "upcoming";
}

export const PILL_BASE =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full font-heading font-bold uppercase transition-colors";

interface FixtureTabsProps {
  tab: FixtureTab;
  onChange: (tab: FixtureTab) => void;
}

/** Nhóm tab dạng segmented control, viên chỉ báo trượt sang tab đang chọn. */
const FixtureTabs = ({ tab, onChange }: FixtureTabsProps) => {
  const activeIndex = Math.max(
    FIXTURE_TABS.findIndex((item) => item.value === tab),
    0,
  );

  return (
    // 3 cột đều nhau để viên chỉ báo trượt đúng 1 cột
    <div
      role="tablist"
      aria-label="Lịch thi đấu, kết quả và bảng xếp hạng"
      className="relative grid grid-cols-3 w-full max-w-md p-1 rounded-full bg-gray-100 sm:max-w-lg"
    >
      {/* Viên chỉ báo rộng đúng 1/3 phần trong (đã trừ padding 0.25rem mỗi bên) */}
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-secondary shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {FIXTURE_TABS.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={item.value === tab}
          onClick={() => onChange(item.value)}
          className={`${PILL_BASE} relative z-10 px-1 py-2.5 text-[0.625rem] tracking-wide duration-300 cursor-pointer sm:px-6 sm:text-xs sm:tracking-widest ${
            item.value === tab ? "text-white" : "text-gray-500 hover:text-secondary"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default FixtureTabs;
