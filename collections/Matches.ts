import type { CollectionBeforeChangeHook, CollectionConfig, PayloadRequest } from 'payload'

import { TEAM_NAME } from '@/data/matches'
import { COMPETITION_OPTIONS } from '@/lib/competition'

/** Lấy tên đội từ giá trị field relationship — có thể là ID hoặc doc đã populate. */
async function resolveClubName(req: PayloadRequest, value: unknown): Promise<string> {
  if (!value) return ''

  if (typeof value === 'object' && value !== null && 'name' in value) {
    return String((value as { name?: unknown }).name ?? '')
  }

  try {
    const club = await req.payload.findByID({ collection: 'clubs', id: String(value), depth: 0 })
    return club?.name ?? ''
  } catch {
    return ''
  }
}

/**
 * Tiêu đề hiển thị trong admin, ví dụ "Thép Xanh Nam Định vs Hà Nội".
 * Field relationship không dùng làm `useAsTitle` được nên phải "đóng băng" tên đội
 * vào một ô text mỗi lần lưu (cùng cách làm với collection Standings).
 */
const fillTitle: CollectionBeforeChangeHook = async ({ data, req }) => {
  const [homeClubName, awayClubName] = await Promise.all([
    resolveClubName(req, data.homeClub),
    resolveClubName(req, data.awayClub),
  ])

  const home = homeClubName || data.homeTeam || ''
  const away = awayClubName || data.awayTeam || ''

  return { ...data, title: home && away ? `${home} vs ${away}` : home || away || 'Trận đấu' }
}

/** Mặc định đội nhà là CLB của chúng ta — tìm theo tên trong collection `clubs`. */
const defaultHomeClub = async ({ req }: { req: PayloadRequest }) => {
  try {
    const found = await req.payload.find({
      collection: 'clubs',
      where: { name: { equals: TEAM_NAME } },
      limit: 1,
      depth: 0,
    })
    return found.docs[0]?.id
  } catch {
    return undefined
  }
}

export const Matches: CollectionConfig = {
  slug: 'matches',
  labels: { singular: 'Trận đấu', plural: 'Trận đấu' },
  access: {
    // Trang Lịch thi đấu là trang public nên cần mở quyền đọc
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['date', 'homeClub', 'awayClub', 'competition', 'status'],
    description: 'Đội nhà / đội khách chọn từ collection Đội bóng — logo đi theo đội, không nhập lại ở đây.',
  },
  defaultSort: '-date',
  hooks: { beforeChange: [fillTitle] },
  fields: [
    { name: 'title', type: 'text', label: 'Tiêu đề', admin: { hidden: true } },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Ngày giờ thi đấu',
      admin: {
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'homeClub',
          type: 'relationship',
          relationTo: 'clubs',
          required: true,
          label: 'Đội nhà',
          defaultValue: defaultHomeClub,
          admin: { width: '50%' },
        },
        {
          name: 'awayClub',
          type: 'relationship',
          relationTo: 'clubs',
          required: true,
          label: 'Đội khách',
          admin: { width: '50%' },
        },
      ],
    },
    /**
     * Hai ô text của thời kỳ trước collection `clubs`. Giữ lại để các trận cũ vẫn
     * hiện đúng tên đội ngoài trang public; trận mới luôn dùng `homeClub`/`awayClub`.
     * Khi mọi trận đã chọn đội bóng thì xoá được hai field này.
     */
    { name: 'homeTeam', type: 'text', label: 'Đội nhà (dữ liệu cũ)', admin: { hidden: true, readOnly: true } },
    { name: 'awayTeam', type: 'text', label: 'Đội khách (dữ liệu cũ)', admin: { hidden: true, readOnly: true } },
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
