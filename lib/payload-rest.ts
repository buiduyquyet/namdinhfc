import type { Media } from '@/payload-types'

/** Kết quả phân trang chuẩn của Payload REST API. */
export interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

/** Base URL của Payload REST API — luôn kết thúc bằng dấu "/". */
export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000/'
  return url.endsWith('/') ? url : `${url}/`
}

/**
 * Gọi Payload REST API. Ném lỗi khi response không OK để nơi gọi tự xử lý fallback
 * (theo quy ước: log lỗi + trả dữ liệu rỗng, không để trang crash).
 */
export async function payloadFetch<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${getBaseUrl()}api/${path}`, { next: { revalidate } })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(
      `Payload API ${path} responded with status ${res.status}: ${body.slice(0, 300)}`,
    )
  }

  return res.json() as Promise<T>
}

/** Lấy URL ảnh từ field upload của Payload (đã populate hoặc chỉ còn ID). */
export function resolveMediaUrl(media?: string | Media | null): string {
  if (!media || typeof media === 'string') return ''
  return media.url || ''
}

/** Lấy alt text của ảnh, fallback về chuỗi cho trước. */
export function resolveMediaAlt(media: string | Media | null | undefined, fallback: string): string {
  if (!media || typeof media === 'string') return fallback
  return media.alt || fallback
}
