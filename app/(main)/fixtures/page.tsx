import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import FixturesBrowser from "@/components/fixtures/FixturesBrowser";
import { parseFixtureTab } from "@/components/fixtures/FixtureTabs";
import type { Competition } from "@/data/matches";
import { COMPETITION_OPTIONS } from "@/lib/competition";
import { getMatches } from "@/lib/matches-api";
import { getLeagueStandings } from "@/lib/standings-api";

export const metadata: Metadata = {
  title: "Lịch Thi Đấu",
  description:
    "Lịch thi đấu, kết quả và bảng xếp hạng mới nhất của CLB Thép Xanh Nam Định tại V.League 1, Cúp Quốc Gia và AFC Champions League Two.",
};

/** Giải mở sẵn ở tab Bảng xếp hạng. */
const DEFAULT_STANDINGS_COMPETITION: Competition = "V.League 1";

interface FixturesPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function FixturesPage({ searchParams }: FixturesPageProps) {
  const { tab } = await searchParams;

  // Tải sẵn dữ liệu của cả 3 tab để phần tương tác không phải gọi lại server
  const [upcomingMatches, finishedMatches, ...standingsList] = await Promise.all([
    getMatches({ group: "upcoming" }),
    getMatches({ group: "finished" }),
    ...COMPETITION_OPTIONS.map((option) => getLeagueStandings(option.value)),
  ]);

  const standingsByCompetition = Object.fromEntries(
    COMPETITION_OPTIONS.map((option, index) => [option.value, standingsList[index]]),
  );

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Lịch Thi Đấu"
        subtitle="Lịch thi đấu, kết quả và bảng xếp hạng của Thép Xanh Nam Định"
        breadcrumbs={[{ label: "Lịch Thi Đấu", href: "/fixtures" }]}
      />

      <section className="section">
        <div className="container">
          <FixturesBrowser
            upcomingMatches={upcomingMatches}
            finishedMatches={finishedMatches}
            standingsByCompetition={standingsByCompetition}
            initialTab={parseFixtureTab(tab)}
            defaultStandingsCompetition={DEFAULT_STANDINGS_COMPETITION}
          />
        </div>
      </section>
    </main>
  );
}
