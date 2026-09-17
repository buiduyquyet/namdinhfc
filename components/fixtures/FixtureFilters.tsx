import Link from "next/link";

import type { Competition } from "@/data/matches";
import { COMPETITION_OPTIONS } from "@/lib/competition";

export type FixtureTab = "upcoming" | "results" | "standings";

interface FixtureFiltersProps {
  tab: FixtureTab;
  competition?: Competition;
}

const TABS: { label: string; value: FixtureTab }[] = [
  { label: "Lịch Thi Đấu", value: "upcoming" },
  { label: "Kết Quả", value: "results" },
  { label: "Bảng Xếp Hạng", value: "standings" },
];

/** Giải mặc định của tab Bảng xếp hạng — không có lựa chọn "Tất cả giải" vì mỗi giải một bảng. */
export const DEFAULT_STANDINGS_COMPETITION: Competition = "V.League 1";

const PILL_BASE =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full font-heading font-bold uppercase transition-colors";

/** Sinh href giữ lại các bộ lọc còn hiệu lực. */
function buildHref(tab: FixtureTab, competition?: Competition): string {
  const params = new URLSearchParams();
  if (tab !== "upcoming") params.set("tab", tab);
  // Tab Bảng xếp hạng đã mặc định V.League 1 nên không cần ghi vào URL
  const isDefaultStandings = tab === "standings" && competition === DEFAULT_STANDINGS_COMPETITION;
  if (competition && !isDefaultStandings) params.set("competition", competition);

  const query = params.toString();
  return query ? `/fixtures?${query}` : "/fixtures";
}

const FixtureFilters = ({ tab, competition }: FixtureFiltersProps) => {
  const competitionTabs =
    tab === "standings"
      ? COMPETITION_OPTIONS
      : [{ label: "Tất cả giải", value: undefined }, ...COMPETITION_OPTIONS];

  return (
    <div className="flex flex-col items-center gap-5 mb-10">
      {/* Lịch thi đấu / Kết quả / Bảng xếp hạng — mobile chia 3 cột đều, từ `sm` co theo nội dung */}
      <div className="grid grid-cols-3 w-full max-w-md p-1 rounded-full bg-gray-100 sm:inline-flex sm:w-auto sm:max-w-none">
        {TABS.map((item) => (
          <Link
            key={item.value}
            href={buildHref(
              item.value,
              // Bộ lọc giải của bảng xếp hạng (luôn có giải) và của danh sách trận (có "Tất cả giải")
              // khác nghĩa nhau, nên chỉ giữ lại khi chuyển tab trong cùng một loại
              (item.value === "standings") === (tab === "standings") ? competition : undefined,
            )}
            aria-current={item.value === tab ? "page" : undefined}
            className={`${PILL_BASE} px-1 py-2.5 text-[0.625rem] tracking-wide sm:px-6 sm:text-xs sm:tracking-widest ${
              item.value === tab
                ? "bg-secondary text-white shadow-sm"
                : "text-gray-500 hover:text-secondary"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Lọc theo giải đấu — mobile là 1 hàng cuộn ngang thay vì xuống nhiều dòng */}
      {/* `-mx-6 px-6` khớp padding của .container dưới 640px để hàng cuộn chạm mép màn hình */}
      <div className="no-scrollbar flex self-stretch gap-2 -mx-6 px-6 overflow-x-auto sm:self-auto sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {competitionTabs.map((item) => {
          const isActive = item.value === competition;
          return (
            <Link
              key={item.label}
              href={buildHref(tab, item.value)}
              aria-current={isActive ? "page" : undefined}
              className={`${PILL_BASE} shrink-0 px-4 py-2 text-[0.6875rem] tracking-widest ${
                isActive
                  ? "bg-primary-50 text-secondary"
                  : "bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-secondary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FixtureFilters;
