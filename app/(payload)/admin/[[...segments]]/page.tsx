import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@/payload.config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

/**
 * Thiếu hàm này thì trang admin không có <title> nào, nên `admin.meta` trong
 * payload.config.ts (tiêu đề tab tiếng Việt) bị bỏ qua hoàn toàn.
 *
 * Bắt buộc `await import()` chứ KHÔNG dùng biến `config` import sẵn ở trên:
 * `next dev` externalize package `payload`, nên lúc Next gọi generateMetadata
 * thì module payload.config chưa khởi tạo xong và `config` còn là `undefined`
 * → "Cannot read properties of undefined (reading 'collections')".
 * Lỗi chỉ xuất hiện ở dev, `next build` thì không.
 */
export const generateMetadata = async ({ params, searchParams }: Args) => {
  const { default: cfg } = await import('@/payload.config')
  return generatePageMetadata({ config: cfg, params, searchParams })
}

export default function Page({ params, searchParams }: Args) {
  return <RootPage config={config} importMap={importMap} params={params} searchParams={searchParams} />
}
