import type { CollectionConfig } from 'payload'

export const Matches: CollectionConfig = {
  slug: 'matches',
  admin: {
    useAsTitle: 'homeTeam',
  },
  fields: [
    { name: 'date', type: 'date', required: true, label: 'Ngày giờ thi đấu' },
    { name: 'homeTeam', type: 'text', required: true, label: 'Đội nhà', defaultValue: 'Thép Xanh Nam Định' },
    { name: 'awayTeam', type: 'text', required: true, label: 'Đội khách' },
    { name: 'homeLogo', type: 'upload', relationTo: 'media', label: 'Logo đội nhà' },
    { name: 'awayLogo', type: 'upload', relationTo: 'media', label: 'Logo đội khách' },
    { name: 'competition', type: 'text', required: true, label: 'Giải đấu', defaultValue: 'V.League 1' },
    { name: 'status', type: 'select', required: true, label: 'Trạng thái', defaultValue: 'Chưa đá', options: [
      { label: 'Chưa đá', value: 'Chưa đá' },
      { label: 'Đã kết thúc', value: 'Đã kết thúc' },
      { label: 'Đang diễn ra', value: 'Đang diễn ra' },
      { label: 'Bị hoãn', value: 'Bị hoãn' },
    ]},
    { name: 'homeScore', type: 'number', label: 'Bàn thắng đội nhà (nếu đã kết thúc)' },
    { name: 'awayScore', type: 'number', label: 'Bàn thắng đội khách (nếu đã kết thúc)' },
    { name: 'stadium', type: 'text', label: 'Sân vận động', defaultValue: 'Sân vận động Thiên Trường' },
  ],
}
