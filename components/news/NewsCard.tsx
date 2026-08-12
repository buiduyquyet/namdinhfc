import Image from "next/image";
import Link from "next/link";

import { formatDate, toISODate } from "@/lib/format-date";
import type { NewsItem } from "@/lib/news-api";
import { getCategoryLabel } from "@/lib/news-category";

interface NewsCardProps {
  item: NewsItem;
  index?: number;
}

const NewsCard = ({ item, index = 0 }: NewsCardProps) => {
  return (
    <article
      className="card group h-full flex flex-col animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link href={`/news/${item.slug}`} className="flex flex-col h-full">
        {/* Ảnh bìa */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt={item.coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary to-primary-dark" />
          )}
          <span className="badge badge-primary absolute top-3 left-3 shadow-sm">
            {getCategoryLabel(item.category)}
          </span>
        </div>

        {/* Nội dung */}
        <div className="flex flex-col grow p-5">
          <time
            dateTime={toISODate(item.publishedDate)}
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
          >
            {formatDate(item.publishedDate)}
          </time>

          <h3 className="font-heading font-extrabold text-lg text-secondary leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {item.excerpt && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
              {item.excerpt}
            </p>
          )}

          <span className="mt-auto pt-4 font-heading font-bold text-xs uppercase tracking-widest text-primary">
            Đọc tiếp →
          </span>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;
