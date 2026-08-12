import type { CollectionConfig, FieldHook } from 'payload'

import { NEWS_CATEGORY_OPTIONS } from '@/lib/news-category'
import { slugify } from '@/lib/slug'

/** Tự sinh slug từ tiêu đề khi biên tập viên để trống ô Slug. */
const fillSlugFromTitle: FieldHook = ({ data, value }) => {
  const manual = typeof value === 'string' ? value.trim() : ''
  if (manual) return slugify(manual)

  const title = typeof data?.title === 'string' ? data.title : ''
  return slugify(title)
}

export const News: CollectionConfig = {
  slug: 'news',
  access: {
    // Payload tự ẩn bản nháp khỏi request chưa đăng nhập khi bật `versions.drafts`,
    // nên chỉ cần mở read cho trang public.
    read: () => true,
  },
  // Dùng cơ chế nháp/xuất bản gốc của Payload thay cho field trạng thái tự chế
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', '_status'],
  },
  defaultSort: '-publishedDate',
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Tiêu đề' },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Tóm tắt',
      maxLength: 300,
      admin: {
        description: 'Hiển thị ở danh sách tin và thẻ chia sẻ mạng xã hội. Tối đa 300 ký tự.',
      },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Ảnh bìa', required: true },
    { name: 'content', type: 'richText', required: true, label: 'Nội dung' },
    {
      name: 'category',
      type: 'select',
      label: 'Chuyên mục',
      required: true,
      defaultValue: 'doi-bong',
      options: NEWS_CATEGORY_OPTIONS,
      admin: { position: 'sidebar' },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Đường dẫn (Slug)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Để trống sẽ tự sinh từ tiêu đề.',
      },
      hooks: { beforeValidate: [fillSlugFromTitle] },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Ngày đăng',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
      },
    },
  ],
}
