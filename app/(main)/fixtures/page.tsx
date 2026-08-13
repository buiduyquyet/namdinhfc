import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import FixtureFilters, { type FixtureTab } from "@/components/fixtures/FixtureFilters";
import MatchMonthGroup from "@/components/fixtures/MatchMonthGroup";
import { isCompetition } from "@/lib/competition";
import { getMatches, groupMatchesByMonth } from "@/lib/matches-api";

export const metadata: Metadata = {
  title: "Lịch Thi Đấu",
  description:
    "Lịch thi đấu và kết quả mới nhất của CLB Thép Xanh Nam Định tại V.League 1, Cúp Quốc Gia và AFC Champions League Two.",
};

interface FixturesPageProps {
  searchParams: Promise<{ tab?: string; competition?: string }>;
}

export default async function FixturesPage({ searchParams }: FixturesPageProps) {
  const { tab: rawTab, competition: rawCompetition } = await searchParams;

  const tab: FixtureTab = rawTab === "results" ? "results" : "upcoming";
  const competition = isCompetition(rawCompetition) ? rawCompetition : undefined;

  const matches = await getMatches({
    group: tab === "results" ? "finished" : "upcoming",
    competition,
  });

  const groups = groupMatchesByMonth(matches);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Lịch Thi Đấu"
        subtitle="Toàn bộ lịch thi đấu và kết quả của Thép Xanh Nam Định"
        breadcrumbs={[{ label: "Lịch Thi Đấu", href: "/fixtures" }]}
      />

      <section className="section">
        <div className="container">
          <FixtureFilters tab={tab} competition={competition} />

          {groups.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-heading font-bold text-xl text-secondary mb-2">
                {tab === "results" ? "Chưa có kết quả nào" : "Chưa có lịch thi đấu"}
              </p>
              <p className="text-gray-500">
                {competition
                  ? `Không có trận nào ở giải ${competition}. Thử chọn "Tất cả giải".`
                  : "Nội dung đang được cập nhật. Vui lòng quay lại sau."}
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <MatchMonthGroup key={group.key} monthKey={group.key} matches={group.matches} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
