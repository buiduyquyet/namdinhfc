import type { GlobalConfig } from 'payload'

import { PLAYER_SOURCE_FILTER_OPTIONS } from '@/lib/player-source'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cấu hình trang',
  access: {
    // Trang Đội hình cần đọc nguồn dữ liệu đang chọn nên phải mở quyền đọc
    read: () => true,
  },
  fields: [
    {
      name: 'playerDataSource',
      type: 'radio',
      label: 'Nguồn dữ liệu cầu thủ hiển thị ra trang web',
      required: true,
      defaultValue: 'all',
      options: PLAYER_SOURCE_FILTER_OPTIONS,
      admin: {
        layout: 'vertical',
        description:
          'Trang Đội hình chỉ hiển thị cầu thủ có Nguồn dữ liệu trùng với lựa chọn này. Chọn "Tất cả các nguồn" để không lọc.',
      },
    },
  ],
}
