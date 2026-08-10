import type { CollectionConfig } from 'payload'

import { PLAYER_DATA_SOURCE_OPTIONS } from '@/lib/player-source'

export const Players: CollectionConfig = {
  slug: 'players',
  access: {
    // Allow public read access so the squad page can fetch players without auth
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'number', 'position', 'dataSource'],
    components: {
      beforeList: [
        '@/components/admin/SyncButton',
        '@/components/admin/ImportPlayersButton',
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
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Ngày sinh',
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
        description: 'Dùng để tính độ tuổi trung bình hiển thị ở trang Đội hình.',
      },
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh đại diện (Upload)' },
    { name: 'imageUrl', type: 'text', label: 'URL Ảnh từ API' },
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
