import type { CollectionConfig } from 'payload'

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'name',
    components: {
      beforeList: [
        '@/components/admin/SyncButton',
      ],
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
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh đại diện (Upload)' },
    { name: 'imageUrl', type: 'text', label: 'URL Ảnh từ API' },
    {
      name: 'stats',
      type: 'group',
      label: 'Thống kê (Mùa giải hiện tại)',
      fields: [
        { name: 'matchesPlayed', type: 'number', label: 'Số trận đăng ký', defaultValue: 0 },
        { name: 'goals', type: 'number', label: 'Bàn thắng', defaultValue: 0 },
        { name: 'assists', type: 'number', label: 'Kiến tạo', defaultValue: 0 },
        { name: 'yellowCards', type: 'number', label: 'Thẻ vàng', defaultValue: 0 },
        { name: 'redCards', type: 'number', label: 'Thẻ đỏ', defaultValue: 0 },
      ]
    }
  ],
}
