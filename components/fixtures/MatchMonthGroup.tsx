import MatchCard from "@/components/MatchCard";
import type { Match } from "@/data/matches";
import { formatMonthLabel } from "@/lib/format-date";

interface MatchMonthGroupProps {
  /** Mốc ISO bất kỳ trong tháng, dùng để sinh nhãn. */
  monthKey: string;
  matches: Match[];
}

const MatchMonthGroup = ({ monthKey, matches }: MatchMonthGroupProps) => (
  <section className="mb-10 last:mb-0">
    <div className="flex items-center gap-4 mb-5">
      <h2 className="font-heading font-extrabold text-lg md:text-xl text-secondary uppercase tracking-tight shrink-0 first-letter:uppercase">
        {formatMonthLabel(monthKey)}
      </h2>
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs font-bold text-primary px-3 py-1.5 bg-primary/10 rounded-full shrink-0">
        {matches.length} trận
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  </section>
);

export default MatchMonthGroup;
