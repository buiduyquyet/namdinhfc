/**
 * Đẩy toàn bộ file trong `public/media` lên Vercel Blob, giữ nguyên tên file.
 *
 * Các bản ghi Media đang có trong MongoDB chỉ lưu `filename`; URL được sinh lại
 * lúc đọc theo adapter đang bật. Nên chỉ cần upload đúng tên là ảnh cũ hiện lại,
 * không phải sửa gì trong DB.
 *
 * Chạy một lần sau khi đã có `BLOB_READ_WRITE_TOKEN` trong `.env`:
 *   npm run migrate:media
 *
 * Chạy lại nhiều lần vẫn an toàn — file đã có trên Blob sẽ được bỏ qua.
 */
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { list, put } from '@vercel/blob'

const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')
/** Khớp với `cacheControlMaxAge` mặc định của @payloadcms/storage-vercel-blob. */
const CACHE_CONTROL_MAX_AGE = 365 * 24 * 60 * 60

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (!token) {
    throw new Error(
      'Thiếu BLOB_READ_WRITE_TOKEN. Tạo Blob store trên Vercel rồi thêm token vào .env.',
    )
  }

  const files = (await readdir(MEDIA_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)

  if (files.length === 0) {
    console.log('Không có file nào trong public/media.')
    return
  }

  const { blobs } = await list({ token })
  const uploaded = new Set(blobs.map((blob) => blob.pathname))

  let created = 0
  let skipped = 0

  for (const filename of files) {
    if (uploaded.has(filename)) {
      skipped++
      continue
    }

    const body = await readFile(path.join(MEDIA_DIR, filename))
    const blob = await put(filename, body, {
      access: 'public',
      addRandomSuffix: false,
      cacheControlMaxAge: CACHE_CONTROL_MAX_AGE,
      token,
    })

    created++
    console.log(`  ✓ ${filename} → ${blob.url}`)
  }

  console.log(`\nXong: ${created} file đã upload, ${skipped} file đã có sẵn.`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
