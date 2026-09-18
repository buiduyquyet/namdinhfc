import ArrowRight from "@/components/icons/ArrowRight";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { getLatestNews } from "@/lib/news-api";
import { formatDate, toISODate } from "@/lib/format-date";
import { getCategoryLabel } from "@/lib/news-category";

export default async function NewsSection() {
  const items = await getLatestNews(3);
  if (items.length === 0) return null;

  return (
    <section id="tin-tuc" className="home-section">
      <div className="container">
        <SectionTitle
          variant="editorial" eyebrow="Nhịp đập thành Nam" title="Tin mới từ CLB"
          action={{ label: "Tất cả tin tức", href: "/news" }}
        />
        <div className={`home-news-grid ${items.length === 1 ? "home-news-single" : ""}`}>
          {items.map((item, index) => (
            <article key={item.id} className={`home-news-item ${index === 0 ? "home-news-featured" : ""}`}>
              <Link href={`/news/${item.slug}`} className="home-news-link group">
                <div className="home-news-image">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage} alt={item.coverAlt} fill
                      sizes={index === 0 ? "(min-width: 1024px) 700px, 100vw" : "(min-width: 1024px) 200px, (min-width: 640px) 40vw, 100vw"}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : <span className="home-news-placeholder" aria-hidden="true">NĐFC</span>}
                </div>
                <div className="home-news-content">
                  <div className="home-news-meta">
                    <span>{getCategoryLabel(item.category)}</span>
                    <time dateTime={toISODate(item.publishedDate)}>{formatDate(item.publishedDate)}</time>
                  </div>
                  <h3>{item.title}</h3>
                  {item.excerpt && <p>{item.excerpt}</p>}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
