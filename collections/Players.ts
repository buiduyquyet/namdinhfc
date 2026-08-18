import type { CollectionConfig, FieldHook } from 'payload'

import { FEATURED_PLAYERS_LIMIT } from '@/lib/featured-players'
import { PREFERRED_FOOT_OPTIONS } from '@/lib/player-foot'
import { PLAYER_DATA_SOURCE_OPTIONS } from '@/lib/player-source'
import { slugify } from '@/lib/slug'

/** Tự sinh slug từ tên cầu thủ khi quản trị viên để trống ô Slug. */
const fillSlugFromName: FieldHook = ({ data, value }) => {
  const manual = typeof value === 'string' ? value.trim() : ''
  if (manual) return slugify(manual)

  const name = typeof data?.name === 'string' ? data.name : ''
  return slugify(name)
}

export const Players: CollectionConfig = {
  slug: 'players',
  access: {
    // Allow public read access so the squad page can fetch players without auth
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'number', 'position', 'isFeatured', 'dataSource'],
    components: {
      beforeList: ['@/components/admin/ImportPlayersButton'],
    }
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Tên cầu thủ' },
    { name: 'number', type: 'number', required: true, label: 'Số áo' },
    { name: 'position', type: 'select', required: true, label: 'Vị trí', options: [
      { label: 'Thủ môn', value: 'Thủ môn' },
      { label: 'Hậu vệ', value: 'Hậu vệ' },
      { label: 'Tiền vệ', value: 'Tiền vệ' },
      { label: 'Tiền đạo', value: 'Tiền đạo' },
    ]},
    { name: 'nationality', type: 'text', label: 'Quốc tịch', defaultValue: 'Việt Nam' },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Ngày sinh',
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
        description: 'Dùng để tính độ tuổi trung bình hiển thị ở trang Đội hình.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'height',
          type: 'number',
          label: 'Chiều cao (cm)',
          min: 100,
          max: 250,
          admin: { width: '50%', step: 1, placeholder: 'VD: 178' },
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Cân nặng (kg)',
          min: 30,
          max: 150,
          admin: { width: '50%', step: 1, placeholder: 'VD: 72' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'preferredFoot',
          type: 'select',
          label: 'Chân thuận',
          options: PREFERRED_FOOT_OPTIONS,
          admin: { width: '50%' },
        },
        {
          name: 'joinedDate',
          type: 'date',
          label: 'Ngày gia nhập CLB',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
          },
        },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh đại diện (Upload)' },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'URL ảnh (link ngoài)',
      admin: {
        description: 'Dùng khi ảnh nằm ở nơi khác. Bỏ trống nếu đã upload ảnh ở trên.',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Tiểu sử',
      admin: {
        description: 'Hiển thị ở trang chi tiết cầu thủ. Bỏ trống thì trang sẽ ẩn mục này.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Đường dẫn (Slug)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Để trống sẽ tự sinh từ tên cầu thủ.',
      },
      hooks: { beforeValidate: [fillSlugFromName] },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Cầu thủ nổi bật',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: `Hiện ở mục "Ngôi Sao Nổi Bật" ngoài trang chủ. Trang chủ lấy tối đa ${FEATURED_PLAYERS_LIMIT} cầu thủ, ưu tiên theo số áo tăng dần.`,
      },
    },
    {
      name: 'dataSource',
      type: 'select',
      label: 'Nguồn dữ liệu',
      required: true,
      defaultValue: 'manual',
      options: PLAYER_DATA_SOURCE_OPTIONS,
      admin: {
        position: 'sidebar',
        description: 'Cho biết bản ghi này đến từ đâu. Trang public có thể lọc theo nguồn trong Cấu hình trang.',
      },
    },
  ],
}
