/**
 * Đưa ảnh cũ từ `public/media` lên Vercel Blob. Gồm 2 bước:
 *
 *   1. Upload file, giữ nguyên tên (tên file chính là key trên Blob).
 *   2. Cập nhật field `url` của các bản ghi Media trong MongoDB.
 *
 * Bước 2 là bắt buộc: Payload **lưu cứng `url` xuống DB** lúc tạo bản ghi chứ
 * không sinh lại lúc đọc, nên các bản ghi cũ vẫn trỏ `/api/media/file/...`
 * kể cả khi adapter Blob đã bật. Ảnh upload mới thì Payload tự ghi URL Blob.
 *
 * Chạy một lần sau khi đã có `BLOB_READ_WRITE_TOKEN` trong `.env`:
 *   npm run migrate:media
 *
 * Chạy lại nhiều lần vẫn an toàn — file đã có trên Blob sẽ được bỏ qua.
 */
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { list, put } from '@vercel/blob'
import mongoose from 'mongoose'

const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')
/** Khớp với `cacheControlMaxAge` mặc định của @payloadcms/storage-vercel-blob. */
const CACHE_CONTROL_MAX_AGE = 365 * 24 * 60 * 60

/**
 * Dựng base URL của store từ token, đúng cách adapter làm:
 * token dạng `vercel_blob_rw_<store_id>_<random>` → `https://<store_id>.public.blob.vercel-storage.com`
 */
function getBaseUrl(token: string): string {
  const storeId = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase()

  if (!storeId) {
    throw new Error('BLOB_READ_WRITE_TOKEN sai định dạng, phải là vercel_blob_rw_<store_id>_<random>.')
  }

  return `https://${storeId}.public.blob.vercel-storage.com`
}

/** Giống hệt `generateURL` của adapter để URL trong DB khớp với ảnh upload mới. */
function buildBlobUrl(baseUrl: string, filename: string): string {
  return `${baseUrl}/${encodeURIComponent(filename)}`
}

/**
 * Trỏ `url` của các bản ghi Media sang Vercel Blob.
 * Chỉ đụng vào bản ghi có file tương ứng đã nằm trên store, và bỏ qua bản ghi đã đúng.
 */
async function updateMediaUrls(baseUrl: string, onBlob: Set<string>) {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('Thiếu MONGODB_URI, không cập nhật được url của bản ghi Media.')
  }

  await mongoose.connect(uri)

  try {
    const collection = mongoose.connection.db!.collection('media')
    const docs = await collection.find({}, { projection: { filename: 1, url: 1 } }).toArray()

    let updated = 0
    let alreadyOk = 0
    const orphans: string[] = []

    for (const doc of docs) {
      const filename = typeof doc.filename === 'string' ? doc.filename : ''
      if (!filename) continue

      if (!onBlob.has(filename)) {
        orphans.push(filename)
        continue
      }

      const url = buildBlobUrl(baseUrl, filename)
      if (doc.url === url) {
        alreadyOk++
        continue
      }

      await collection.updateOne({ _id: doc._id }, { $set: { url } })
      updated++
    }

    console.log(`\nCập nhật DB: ${updated} bản ghi đã đổi url, ${alreadyOk} bản ghi vốn đã đúng.`)
    if (orphans.length > 0) {
      console.log(`  ⚠ ${orphans.length} bản ghi chưa có file trên Blob, đã bỏ qua: ${orphans.slice(0, 5).join(', ')}`)
    }
  } finally {
    await mongoose.disconnect()
  }
}

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

  const baseUrl = getBaseUrl(token)
  const { blobs } = await list({ token, limit: 1000 })
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

  console.log(`\nUpload: ${created} file mới, ${skipped} file đã có sẵn trên store.`)

  files.forEach((filename) => uploaded.add(filename))
  await updateMediaUrls(baseUrl, uploaded)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
