import type { CollectionBeforeChangeHook, CollectionConfig, Field } from 'payload'

import { COMPETITION_OPTIONS } from '@/lib/competition'
import { normalizeFormInput, validateFormInput } from '@/lib/league-form'

/** Tiêu đề hiển thị trong admin, ví dụ "V.League 1 · 2026/27". */
const fillTitle: CollectionBeforeChangeHook = ({ data }) => ({
  ...data,
  title: [data.competition, data.season].filter(Boolean).join(' · '),
})

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
            { name: 'team', type: 'text', label: 'Tên đội', required: true, admin: { width: '45%' } },
            {
              name: 'shortName',
              type: 'text',
              label: 'Tên ngắn',
              admin: { width: '40%', description: 'Hiển thị trong bảng. Để trống sẽ dùng tên đội.' },
            },
          ],
        },
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
