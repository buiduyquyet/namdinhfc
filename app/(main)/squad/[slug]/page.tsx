import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import PlayerBio from "@/components/squad/PlayerBio";
import PlayerGrid from "@/components/squad/PlayerGrid";
import PlayerProfile from "@/components/squad/PlayerProfile";
import { positionLabels } from "@/data/players";
import { getPlayerBySlug, getSquadmates } from "@/lib/payload-api";

interface PlayerPageProps {
  params: Promise<{ slug: string }>;
}

/** Mô tả ngắn dùng chung cho thẻ meta và OpenGraph. */
function buildDescription(name: string, position: string, number: number): string {
  return `${name} — ${position}, số áo ${number} của CLB Thép Xanh Nam Định. Thông tin cá nhân, thể hình và tiểu sử.`;
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);

  if (!player) {
    return { title: "Không tìm thấy cầu thủ" };
  }

  const description = buildDescription(
    player.name,
    positionLabels[player.position],
    player.number,
  );

  return {
    title: player.name,
    description,
    openGraph: {
      title: player.name,
      description,
      type: "profile",
      images: player.image ? [{ url: player.image }] : undefined,
    },
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);

  if (!player) notFound();

  const squadmates = await getSquadmates(player);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title={player.name}
        subtitle={`${positionLabels[player.position]} · Số áo ${player.number}`}
        breadcrumbs={[
          { label: "Đội Hình", href: "/squad" },
          { label: player.name, href: `/squad/${player.slug}` },
        ]}
      />

      <section className="section">
        <div className="container">
          <PlayerProfile player={player} />

          {player.bio && (
            <div className="mt-12 max-w-3xl">
              <h2 className="font-heading text-2xl md:text-3xl font-black text-secondary uppercase tracking-tight mb-6">
                Tiểu Sử
              </h2>
              <PlayerBio bio={player.bio} />
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/squad" className="btn btn-outline-dark">
              ← Về Trang Đội Hình
            </Link>
          </div>
        </div>
      </section>

      {squadmates.length > 0 && (
        <section className="section-alt">
          <div className="container">
            <SectionTitle
              title="Cùng Vị Trí"
              subtitle={`Các ${positionLabels[player.position].toLowerCase()} khác trong đội hình`}
            />
            <PlayerGrid players={squadmates} />
          </div>
        </section>
      )}
    </main>
  );
}
