import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import type { NewsCategory } from '@/lib/news-category'
import { payloadFetch, resolveMediaAlt, resolveMediaUrl } from '@/lib/payload-rest'
import type { PayloadListResponse } from '@/lib/payload-rest'
import type { News } from '@/payload-types'

/** Bài viết đã chuẩn hoá cho UI — ảnh, tóm tắt và ngày đăng đều đã resolve sẵn. */
export interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  coverAlt: string
  category: News['category']
  publishedDate: string
  content: News['content']
}

export interface NewsListResult {
  items: NewsItem[]
  page: number
  totalPages: number
  totalDocs: number
}

const EMPTY_LIST: NewsListResult = { items: [], page: 1, totalPages: 0, totalDocs: 0 }

/** Cắt chuỗi ở ranh giới từ để tóm tắt không bị đứt giữa chừng. */
function truncate(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return clean

  const cut = clean.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/** Tóm tắt do biên tập viên nhập; nếu để trống thì lấy tự động từ nội dung bài. */
function resolveExcerpt(doc: News): string {
  if (doc.excerpt?.trim()) return doc.excerpt.trim()

  try {
    return truncate(convertLexicalToPlaintext({ data: doc.content }), 180)
  } catch {
    return ''
  }
}

function mapNews(doc: News): NewsItem {
  return {
    id: doc.id.toString(),
    title: doc.title,
    slug: doc.slug || doc.id.toString(),
    excerpt: resolveExcerpt(doc),
    coverImage: resolveMediaUrl(doc.coverImage),
    coverAlt: resolveMediaAlt(doc.coverImage, doc.title),
    category: doc.category,
    publishedDate: doc.publishedDate || doc.createdAt,
    content: doc.content,
  }
}

interface GetNewsListArgs {
  page?: number
  limit?: number
  category?: NewsCategory
}

/**
 * Danh sách bài viết đã xuất bản, mới nhất trước.
 * Lỗi mạng / API → trả danh sách rỗng để trang vẫn render được.
 */
export async function getNewsList({
  page = 1,
  limit = 9,
  category,
}: GetNewsListArgs = {}): Promise<NewsListResult> {
  const params = new URLSearchParams({
    sort: '-publishedDate',
    depth: '1',
    limit: String(limit),
    page: String(page),
  })

  if (category) params.set('where[category][equals]', category)

  try {
    const data = await payloadFetch<PayloadListResponse<News>>(`news?${params.toString()}`)

    return {
      items: data.docs.map(mapNews),
      page: data.page,
      totalPages: data.totalPages,
      totalDocs: data.totalDocs,
    }
  } catch (error) {
    console.error('Failed to fetch news from Payload CMS:', error)
    return EMPTY_LIST
  }
}

/** N bài mới nhất — dùng cho section tin tức ở trang chủ. */
export async function getLatestNews(limit = 3): Promise<NewsItem[]> {
  const { items } = await getNewsList({ limit })
  return items
}

/** Một bài viết theo slug. Trả `null` khi không tìm thấy để page gọi `notFound()`. */
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const params = new URLSearchParams({
    'where[slug][equals]': slug,
    depth: '1',
    limit: '1',
  })

  try {
    const data = await payloadFetch<PayloadListResponse<News>>(`news?${params.toString()}`)
    const doc = data.docs[0]
    return doc ? mapNews(doc) : null
  } catch (error) {
    console.error(`Failed to fetch news "${slug}" from Payload CMS:`, error)
    return null
  }
}

/** Bài liên quan: cùng chuyên mục, loại trừ bài đang xem. */
export async function getRelatedNews(current: NewsItem, limit = 3): Promise<NewsItem[]> {
  const { items } = await getNewsList({ category: current.category, limit: limit + 1 })
  return items.filter((item) => item.id !== current.id).slice(0, limit)
}
