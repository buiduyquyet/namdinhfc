import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Players } from './collections/Players'
import { Clubs } from './collections/Clubs'
import { News } from './collections/News'
import { Matches } from './collections/Matches'
import { Media } from './collections/Media'
import { Standings } from './collections/Standings'
import { SiteSettings } from './globals/SiteSettings'

import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const ADMIN_DESCRIPTION = 'Trang quản trị nội dung website CLB Thép Xanh Nam Định.'

export default buildConfig({
  admin: {
    user: Users.slug,
    // Không khai báo thì Payload dùng title/description mặc định tiếng Anh của họ
    meta: {
      titleSuffix: '— Quản trị Nam Định FC',
      description: ADMIN_DESCRIPTION,
      openGraph: {
        siteName: 'Quản trị Nam Định FC',
        description: ADMIN_DESCRIPTION,
      },
    },
  },
  /**
   * Admin chỉ dùng tiếng Việt: khai báo đúng một ngôn ngữ nên Payload bỏ luôn ô
   * chọn ngôn ngữ trong Tài khoản, và tài khoản cũ từng lưu `language: 'en'`
   * cũng hiển thị tiếng Việt.
   *
   * `translations` chỉ ghi đè vài key mà gói `vi` còn để nguyên tiếng Anh.
   */
  i18n: {
    fallbackLanguage: 'vi',
    supportedLanguages: { vi },
    translations: {
      vi: {
        general: {
          collections: 'Nội dung',
          globals: 'Cấu hình chung',
          menu: 'Trình đơn',
        },
      },
    },
  },
  collections: [Users, Players, News, Clubs, Matches, Standings, Media],
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
