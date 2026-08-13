import Link from "next/link";

import type { Competition } from "@/data/matches";
import { COMPETITION_OPTIONS } from "@/lib/competition";

export type FixtureTab = "upcoming" | "results";

interface FixtureFiltersProps {
  tab: FixtureTab;
  competition?: Competition;
}

const TABS: { label: string; value: FixtureTab }[] = [
  { label: "Lịch Thi Đấu", value: "upcoming" },
  { label: "Kết Quả", value: "results" },
];

const PILL_BASE =
  "inline-flex items-center rounded-full font-heading font-bold uppercase tracking-widest transition-colors";

/** Sinh href giữ lại các bộ lọc còn hiệu lực. */
function buildHref(tab: FixtureTab, competition?: Competition): string {
  const params = new URLSearchParams();
  if (tab === "results") params.set("tab", "results");
  if (competition) params.set("competition", competition);

  const query = params.toString();
  return query ? `/fixtures?${query}` : "/fixtures";
}

const FixtureFilters = ({ tab, competition }: FixtureFiltersProps) => {
  const competitionTabs = [{ label: "Tất cả giải", value: undefined }, ...COMPETITION_OPTIONS];

  return (
    <div className="flex flex-col items-center gap-5 mb-10">
      {/* Lịch thi đấu / Kết quả */}
      <div className="inline-flex p-1 rounded-full bg-gray-100">
        {TABS.map((item) => (
          <Link
            key={item.value}
            href={buildHref(item.value, competition)}
            aria-current={item.value === tab ? "page" : undefined}
            className={`${PILL_BASE} px-6 py-2.5 text-xs ${
              item.value === tab
                ? "bg-secondary text-white shadow-sm"
                : "text-gray-500 hover:text-secondary"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Lọc theo giải đấu */}
      <div className="flex flex-wrap justify-center gap-2">
        {competitionTabs.map((item) => {
          const isActive = item.value === competition;
          return (
            <Link
              key={item.label}
              href={buildHref(tab, item.value)}
              aria-current={isActive ? "page" : undefined}
              className={`${PILL_BASE} px-4 py-2 text-[0.6875rem] ${
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
