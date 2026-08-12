import Link from "next/link";

import SectionTitle from "@/components/SectionTitle";
import NewsCard from "@/components/news/NewsCard";
import { getLatestNews } from "@/lib/news-api";

export default async function NewsSection() {
  const items = await getLatestNews(3);

  // Chưa có bài viết nào thì ẩn hẳn section thay vì hiện khối rỗng
  if (items.length === 0) return null;

  // Nền trắng (.section) để tách khỏi LatestResultsSection (.section-alt) ngay phía trên
  return (
    <section id="tin-tuc" className="section">
      <div className="container">
        <SectionTitle
          title="Tin Tức Mới Nhất"
          subtitle="Cập nhật hoạt động mới nhất của Thép Xanh Nam Định"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/news" className="btn btn-outline-dark">
            Xem Tất Cả Tin Tức
          </Link>
        </div>
      </div>
    </section>
  );
}
