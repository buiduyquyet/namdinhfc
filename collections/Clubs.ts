import type { CollectionConfig, FieldHook } from 'payload'

import { CLUB_LEAGUE_OPTIONS, SEASON_PATTERN } from '@/lib/club-league'
import { slugify } from '@/lib/slug'

/** Tự sinh slug từ tên đội khi quản trị viên để trống ô Slug. */
const fillSlugFromName: FieldHook = ({ data, value }) => {
  const manual = typeof value === 'string' ? value.trim() : ''
  if (manual) return slugify(manual)

  const name = typeof data?.name === 'string' ? data.name : ''
  return slugify(name)
}

export const Clubs: CollectionConfig = {
  slug: 'clubs',
  labels: { singular: 'Đội bóng', plural: 'Đội bóng' },
  access: {
    // Trang Lịch thi đấu đọc tên + logo đội qua relationship nên cần mở quyền đọc
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'league', 'season', 'stadium'],
    description:
      'Danh bạ các đội bóng. Trận đấu chọn đội từ đây nên logo chỉ cần khai báo một lần.',
    components: {
      beforeList: ['@/components/admin/ImportClubsButton'],
    },
  },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true, unique: true, index: true, label: 'Tên đội' },
    {
      type: 'row',
      fields: [
        {
          name: 'league',
          type: 'select',
          required: true,
          label: 'Giải đấu',
          defaultValue: 'V.League 1',
          options: CLUB_LEAGUE_OPTIONS,
          admin: { width: '50%' },
        },
        {
          name: 'season',
          type: 'text',
          label: 'Mùa giải',
          admin: { width: '50%', placeholder: '2026/27' },
          validate: (value: string | null | undefined) =>
            !value || SEASON_PATTERN.test(value) || 'Nhập theo dạng 2026/27.',
        },
      ],
    },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo (Upload)' },
    {
      name: 'logoUrl',
      type: 'text',
      label: 'URL logo (link ngoài)',
      admin: {
        description:
          'Dùng khi logo nằm ở nơi khác (VD: link vpf.vn trong file Excel). Bỏ trống nếu đã upload logo ở trên.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'stadium', type: 'text', label: 'Sân nhà', admin: { width: '50%' } },
        { name: 'city', type: 'text', label: 'Tỉnh / Thành phố', admin: { width: '50%' } },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Đường dẫn (Slug)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Để trống sẽ tự sinh từ tên đội.',
      },
      hooks: { beforeValidate: [fillSlugFromName] },
    },
  ],
}
