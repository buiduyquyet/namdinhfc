import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Chỉ dùng khi chạy ở máy local. Khi deploy, plugin `vercelBlobStorage`
    // trong `payload.config.ts` chiếm chỗ và đẩy file lên Vercel Blob.
    staticDir: 'public/media',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Văn bản thay thế (Alt text)',
    },
  ],
}
