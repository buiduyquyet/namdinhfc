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
