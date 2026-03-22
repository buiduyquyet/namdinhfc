import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Tiêu đề' },
    { name: 'slug', type: 'text', label: 'Đường dẫn (Slug)', admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Ảnh bìa', required: true },
    { name: 'content', type: 'richText', required: true, label: 'Nội dung' },
    { name: 'publishedDate', type: 'date', label: 'Ngày đăng' },
    { name: 'status', type: 'select', label: 'Trạng thái', options: [
      { label: 'Nháp', value: 'draft' },
      { label: 'Đã xuất bản', value: 'published' }
    ], defaultValue: 'published', admin: { position: 'sidebar' } },
  ],
}
