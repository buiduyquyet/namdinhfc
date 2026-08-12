import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import ArticleContent from "@/components/news/ArticleContent";
import NewsCard from "@/components/news/NewsCard";
import { formatDateTime, toISODate } from "@/lib/format-date";
import { getNewsBySlug, getRelatedNews } from "@/lib/news-api";
import { getCategoryLabel } from "@/lib/news-category";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return { title: "Không tìm thấy bài viết" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedDate,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) notFound();

  const related = await getRelatedNews(article);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title={article.title}
        breadcrumbs={[
          { label: "Tin Tức", href: "/news" },
          { label: article.title, href: `/news/${article.slug}` },
        ]}
      />

      <article className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link
                href={`/news?category=${article.category}`}
                className="badge badge-primary"
              >
                {getCategoryLabel(article.category)}
              </Link>
              <time
                dateTime={toISODate(article.publishedDate)}
                className="text-sm text-gray-400 font-medium"
              >
                {formatDateTime(article.publishedDate)}
              </time>
            </div>

            {/* Ảnh bìa */}
            {article.coverImage && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
                <Image
                  src={article.coverImage}
                  alt={article.coverAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Tóm tắt */}
            {article.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed font-medium border-l-4 border-primary pl-5 mb-8">
                {article.excerpt}
              </p>
            )}

            {/* Nội dung */}
            <ArticleContent content={article.content} />

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link href="/news" className="btn btn-outline-dark">
                ← Về Trang Tin Tức
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Bài liên quan */}
      {related.length > 0 && (
        <section className="section-alt">
          <div className="container">
            <SectionTitle
              title="Bài Viết Liên Quan"
              subtitle={`Thêm tin trong chuyên mục ${getCategoryLabel(article.category)}`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item, index) => (
                <NewsCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
