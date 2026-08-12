import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import CategoryTabs from "@/components/news/CategoryTabs";
import NewsCard from "@/components/news/NewsCard";
import Pagination from "@/components/news/Pagination";
import { getNewsList } from "@/lib/news-api";
import { getCategoryLabel, isNewsCategory } from "@/lib/news-category";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Tin Tức",
  description:
    "Tin tức mới nhất về CLB Thép Xanh Nam Định — hoạt động đội bóng, kết quả trận đấu, chuyển nhượng và cộng đồng người hâm mộ.",
};

interface NewsPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page: rawPage, category: rawCategory } = await searchParams;

  const category = isNewsCategory(rawCategory) ? rawCategory : undefined;
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { items, totalPages, totalDocs } = await getNewsList({
    page,
    limit: PAGE_SIZE,
    category,
  });

  const basePath = category ? `/news?category=${category}` : "/news";

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Tin Tức"
        subtitle="Cập nhật mới nhất từ Thép Xanh Nam Định"
        breadcrumbs={[{ label: "Tin Tức", href: "/news" }]}
      />

      <section className="section">
        <div className="container">
          <CategoryTabs active={category} />

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-heading font-bold text-xl text-secondary mb-2">
                Chưa có bài viết nào
              </p>
              <p className="text-gray-500">
                {category
                  ? `Chuyên mục "${getCategoryLabel(category)}" hiện chưa có bài viết. Vui lòng quay lại sau.`
                  : "Nội dung đang được cập nhật. Vui lòng quay lại sau."}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">
                {totalDocs} bài viết
                {category ? ` trong chuyên mục ${getCategoryLabel(category)}` : ""}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <NewsCard key={item.id} item={item} index={index} />
                ))}
              </div>

              <Pagination page={page} totalPages={totalPages} basePath={basePath} />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
