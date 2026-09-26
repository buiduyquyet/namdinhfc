import type { CollectionBeforeChangeHook, CollectionConfig, Field, PayloadRequest } from 'payload'

import { COMPETITION_OPTIONS } from '@/lib/competition'
import { normalizeFormInput, validateFormInput } from '@/lib/league-form'

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
 * Tiêu đề hiển thị trong admin ("V.League 1 · 2026/27") và tên đội của từng dòng.
 * `rows[].team` là bản sao tên CLB, chỉ để nhãn hàng trong admin đọc được khi thu gọn —
 * dữ liệu thật luôn nằm ở `rows[].club`.
 */
const fillTitle: CollectionBeforeChangeHook = async ({ data, req }) => {
  const title = [data.competition, data.season].filter(Boolean).join(' · ')

  // Cập nhật từng phần (VD: PATCH mỗi field `matchday`) không kèm `rows` — đừng đụng vào
  if (!Array.isArray(data.rows)) return { ...data, title }

  const rows = await Promise.all(
    data.rows.map(async (row: Record<string, unknown>) => ({
      ...row,
      team: (await resolveClubName(req, row.club)) || row.team || '',
    })),
  )

  return { ...data, title, rows }
}

/** Ô số liệu thống kê. `allowNegative` cho cột Điểm vì đội có thể bị trừ điểm. */
const statField = (name: string, label: string, allowNegative = false): Field => ({
  name,
  type: 'number',
  label,
  required: true,
  defaultValue: 0,
  ...(allowNegative ? {} : { min: 0 }),
  admin: { width: '12%' },
})

export const Standings: CollectionConfig = {
  slug: 'standings',
  labels: { singular: 'Bảng xếp hạng', plural: 'Bảng xếp hạng' },
  access: {
    // Trang chủ hiển thị bảng xếp hạng nên cần mở quyền đọc
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'matchday', 'updatedAt'],
    description:
      'Mỗi mùa giải của một giải đấu là một bản ghi. Trang chủ hiển thị bảng V.League 1 của mùa mới nhất.',
  },
  defaultSort: '-season',
  hooks: { beforeChange: [fillTitle] },
  fields: [
    { name: 'title', type: 'text', label: 'Tiêu đề', admin: { hidden: true } },
    {
      type: 'row',
      fields: [
        {
          name: 'competition',
          type: 'select',
          required: true,
          label: 'Giải đấu',
          defaultValue: 'V.League 1',
          options: COMPETITION_OPTIONS,
          admin: { width: '40%' },
        },
        {
          name: 'season',
          type: 'text',
          required: true,
          label: 'Mùa giải',
          admin: { width: '30%', placeholder: '2026/27' },
          validate: (value: string | null | undefined) =>
            /^\d{4}\/\d{2}$/.test(value ?? '') || 'Nhập theo dạng 2026/27.',
        },
        {
          name: 'matchday',
          type: 'number',
          label: 'Cập nhật sau vòng',
          min: 0,
          admin: { width: '30%' },
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Thứ hạng các đội',
      labels: { singular: 'Đội', plural: 'Các đội' },
      admin: {
        initCollapsed: true,
        description:
          'Trang web sắp xếp theo cột "Hạng". Hiệu số được tự tính từ bàn thắng và bàn thua.',
        components: { RowLabel: '@/components/admin/StandingRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'position', type: 'number', label: 'Hạng', required: true, min: 1, admin: { width: '15%' } },
            {
              name: 'club',
              type: 'relationship',
              relationTo: 'clubs',
              required: true,
              label: 'Đội bóng',
              admin: { width: '45%', description: 'Logo hiển thị trong bảng lấy theo đội đã chọn.' },
            },
            {
              name: 'shortName',
              type: 'text',
              label: 'Tên ngắn',
              admin: { width: '40%', description: 'Hiển thị trong bảng. Để trống sẽ dùng tên đội.' },
            },
          ],
        },
        /**
         * Tên đội của thời kỳ trước collection `clubs`. Hook `fillTitle` ghi đè bằng tên
         * CLB mỗi lần lưu; giữ lại để bảng cũ vẫn hiện đúng tên khi chưa chọn đội.
         */
        { name: 'team', type: 'text', label: 'Tên đội (dữ liệu cũ)', admin: { hidden: true, readOnly: true } },
        {
          type: 'row',
          fields: [
            statField('played', 'Số trận'),
            statField('won', 'Thắng'),
            statField('drawn', 'Hòa'),
            statField('lost', 'Thua'),
            statField('goalsFor', 'Bàn thắng'),
            statField('goalsAgainst', 'Bàn thua'),
            statField('points', 'Điểm', true),
          ],
        },
        {
          name: 'form',
          type: 'text',
          label: 'Phong độ',
          admin: {
            description: 'Tối đa 5 trận, cũ → mới. T = thắng, H = hòa, B = thua. Ví dụ: THBTT',
          },
          validate: validateFormInput,
          hooks: { beforeChange: [({ value }) => normalizeFormInput(value)] },
        },
      ],
    },
  ],
}
