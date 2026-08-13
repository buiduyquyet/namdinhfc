import type { CollectionConfig } from 'payload'

import { COMPETITION_OPTIONS } from '@/lib/competition'

export const Matches: CollectionConfig = {
  slug: 'matches',
  access: {
    // Trang Lịch thi đấu là trang public nên cần mở quyền đọc
    read: () => true,
  },
  admin: {
    useAsTitle: 'awayTeam',
    defaultColumns: ['date', 'homeTeam', 'awayTeam', 'competition', 'status'],
  },
  defaultSort: '-date',
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Ngày giờ thi đấu',
      admin: {
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
      },
    },
    { name: 'homeTeam', type: 'text', required: true, label: 'Đội nhà', defaultValue: 'Thép Xanh Nam Định' },
    { name: 'awayTeam', type: 'text', required: true, label: 'Đội khách' },
    { name: 'homeLogo', type: 'upload', relationTo: 'media', label: 'Logo đội nhà' },
    { name: 'awayLogo', type: 'upload', relationTo: 'media', label: 'Logo đội khách' },
    {
      name: 'competition',
      type: 'select',
      required: true,
      label: 'Giải đấu',
      defaultValue: 'V.League 1',
      options: COMPETITION_OPTIONS,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Trạng thái',
      defaultValue: 'Chưa đá',
      options: [
        { label: 'Chưa đá', value: 'Chưa đá' },
        { label: 'Đã kết thúc', value: 'Đã kết thúc' },
        { label: 'Đang diễn ra', value: 'Đang diễn ra' },
        { label: 'Bị hoãn', value: 'Bị hoãn' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'homeScore',
          type: 'number',
          label: 'Bàn thắng đội nhà',
          admin: {
            width: '50%',
            description: 'Chỉ điền khi trận đã kết thúc hoặc đang diễn ra.',
          },
        },
        { name: 'awayScore', type: 'number', label: 'Bàn thắng đội khách', admin: { width: '50%' } },
      ],
    },
    { name: 'stadium', type: 'text', label: 'Sân vận động', defaultValue: 'Sân vận động Thiên Trường' },
    {
      name: 'matchday',
      type: 'number',
      label: 'Vòng đấu',
      admin: { position: 'sidebar' },
    },
    {
      name: 'ticketUrl',
      type: 'text',
      label: 'Link mua vé',
      admin: {
        position: 'sidebar',
        description: 'Hiện nút "Mua vé" ở trang Lịch thi đấu cho trận chưa đá.',
      },
    },
    {
      name: 'highlightUrl',
      type: 'text',
      label: 'Link highlight',
      admin: {
        position: 'sidebar',
        description: 'Hiện nút "Xem highlight" cho trận đã kết thúc.',
      },
    },
  ],
}
