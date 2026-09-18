"use client";

import { useMemo, useRef, useState } from "react";

import LeagueTable from "@/components/LeagueTable";
import PanelCard from "@/components/PanelCard";
import CompetitionFilter from "@/components/fixtures/CompetitionFilter";
import FixtureEmptyState from "@/components/fixtures/FixtureEmptyState";
import FixtureTabs, { type FixtureTab } from "@/components/fixtures/FixtureTabs";
import MatchMonthGroup from "@/components/fixtures/MatchMonthGroup";
import type { LeagueStandings } from "@/data/league-table";
import type { Competition, Match } from "@/data/matches";
import { groupMatchesByMonth } from "@/lib/matches-api";

interface FixturesBrowserProps {
  upcomingMatches: Match[];
  finishedMatches: Match[];
  /** Bảng xếp hạng của từng giải, tải sẵn để đổi giải không phải gọi lại server. */
  standingsByCompetition: Partial<Record<Competition, LeagueStandings | null>>;
  /** Tab mở đầu, lấy từ `?tab=` để link từ nơi khác vẫn vào đúng chỗ. */
  initialTab: FixtureTab;
  defaultStandingsCompetition: Competition;
}

interface StandingsPanelProps {
  standings?: LeagueStandings | null;
  competition: Competition;
}

const StandingsPanel = ({ standings, competition }: StandingsPanelProps) => {
  if (!standings || standings.entries.length === 0) {
    return (
      <FixtureEmptyState
        title="Chưa có bảng xếp hạng"
        message={`Bảng xếp hạng ${competition} đang được cập nhật. Vui lòng quay lại sau.`}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PanelCard
        title={`${standings.competition} · ${standings.season}`}
        caption={standings.matchday ? `Cập nhật sau vòng ${standings.matchday}` : undefined}
      >
        <LeagueTable teams={standings.entries} />
      </PanelCard>
    </div>
  );
};

interface MatchListProps {
  groups: ReturnType<typeof groupMatchesByMonth>;
  tab: Exclude<FixtureTab, "standings">;
  competition?: Competition;
}

const MatchList = ({ groups, tab, competition }: MatchListProps) => {
  if (groups.length === 0) {
    return (
      <FixtureEmptyState
        title={tab === "results" ? "Chưa có kết quả nào" : "Chưa có lịch thi đấu"}
        message={
          competition
            ? `Không có trận nào ở giải ${competition}. Thử chọn "Tất cả giải".`
            : "Nội dung đang được cập nhật. Vui lòng quay lại sau."
        }
      />
    );
  }

  return groups.map((group) => (
    <MatchMonthGroup key={group.key} monthKey={group.key} matches={group.matches} />
  ));
};

/**
 * Toàn bộ phần tương tác của trang Lịch thi đấu: tab, bộ lọc giải và nội dung.
 * Dữ liệu 3 tab được tải sẵn từ server nên đổi tab / đổi giải là tức thì và
 * **không ghi gì lên URL**. Mỗi lần đổi tab thì cuộn về đúng cụm tab.
 */
const FixturesBrowser = ({
  upcomingMatches,
  finishedMatches,
  standingsByCompetition,
  initialTab,
  defaultStandingsCompetition,
}: FixturesBrowserProps) => {
  const [tab, setTab] = useState<FixtureTab>(initialTab);
  const [matchCompetition, setMatchCompetition] = useState<Competition | undefined>(undefined);
  const [standingsCompetition, setStandingsCompetition] = useState<Competition>(
    defaultStandingsCompetition,
  );
  const topRef = useRef<HTMLDivElement>(null);

  const matches = tab === "results" ? finishedMatches : upcomingMatches;

  const groups = useMemo(() => {
    const filtered = matchCompetition
      ? matches.filter((match) => match.competition === matchCompetition)
      : matches;

    return groupMatchesByMonth(filtered);
  }, [matches, matchCompetition]);

  const handleTabChange = (next: FixtureTab) => {
    if (next === tab) return;
    setTab(next);

    // Nội dung 3 tab dài ngắn khác nhau, cuộn về cụm tab để người xem thấy ngay dữ liệu mới
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    topRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const standings = standingsByCompetition[standingsCompetition];

  return (
    <>
      {/* `scroll-mt` chừa chỗ cho header cố định khi cuộn tới */}
      <div ref={topRef} className="flex flex-col items-center gap-5 mb-10 scroll-mt-24">
        <FixtureTabs tab={tab} onChange={handleTabChange} />

        {tab === "standings" ? (
          <CompetitionFilter
            value={standingsCompetition}
            onChange={(value) => value && setStandingsCompetition(value)}
          />
        ) : (
          <CompetitionFilter value={matchCompetition} onChange={setMatchCompetition} withAllOption />
        )}
      </div>

      {/* `key` để nội dung mount lại và chạy hiệu ứng hiện dần mỗi lần đổi tab hoặc đổi giải */}
      <div
        key={`${tab}-${tab === "standings" ? standingsCompetition : (matchCompetition ?? "all")}`}
        className="animate-fade-in"
      >
        {tab === "standings" ? (
          <StandingsPanel standings={standings} competition={standingsCompetition} />
        ) : (
          <MatchList groups={groups} tab={tab} competition={matchCompetition} />
        )}
      </div>
    </>
  );
};

export default FixturesBrowser;
