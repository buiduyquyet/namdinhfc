import { PILL_BASE } from "@/components/fixtures/FixtureTabs";
import type { Competition } from "@/data/matches";
import { COMPETITION_OPTIONS } from "@/lib/competition";

interface CompetitionFilterProps {
  value?: Competition;
  onChange: (competition?: Competition) => void;
  /** Thêm lựa chọn "Tất cả giải" — bảng xếp hạng không dùng vì mỗi giải một bảng riêng. */
  withAllOption?: boolean;
}

/** Hàng pill lọc giải. Mobile cuộn ngang, `-mx-6 px-6` khớp padding `.container` dưới 640px. */
const CompetitionFilter = ({ value, onChange, withAllOption = false }: CompetitionFilterProps) => {
  const options: { label: string; value?: Competition }[] = withAllOption
    ? [{ label: "Tất cả giải", value: undefined }, ...COMPETITION_OPTIONS]
    : COMPETITION_OPTIONS;

  return (
    <div className="no-scrollbar flex self-stretch gap-2 -mx-6 px-6 overflow-x-auto sm:self-auto sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`${PILL_BASE} shrink-0 px-4 py-2 text-[0.6875rem] tracking-widest cursor-pointer ${
              isActive
                ? "bg-primary-50 text-secondary"
                : "bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-secondary"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default CompetitionFilter;
