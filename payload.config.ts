import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Players } from './collections/Players'
import { News } from './collections/News'
import { Matches } from './collections/Matches'
import { Media } from './collections/Media'
import { SiteSettings } from './globals/SiteSettings'

import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Players, News, Matches, Media],
  globals: [SiteSettings],
  editor: lexicalEditor({}),
  // Bắt buộc để chức năng cắt ảnh / focal point trong admin hoạt động —
  // thiếu `sharp`, Payload nhận yêu cầu crop rồi bỏ qua mà không báo lỗi.
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'a-very-secret-string-for-payload-3.0-namdinhfc',
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1/namdinh-fc',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    /**
     * Filesystem của Vercel chỉ đọc nên `public/media` không dùng được khi deploy —
     * ảnh upload phải nằm ở Vercel Blob.
     *
     * Không có `BLOB_READ_WRITE_TOKEN` (máy local) thì plugin tự tắt và Payload
     * quay về lưu vào `public/media` như cũ, nên dev ở máy không cần token.
     */
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
