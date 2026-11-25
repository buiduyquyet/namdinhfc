import type { GlobalConfig } from 'payload'

import { PLAYER_SOURCE_FILTER_OPTIONS } from '@/lib/player-source'
import { DEFAULT_VPF_SEASON_URL, validateVpfSeasonUrl } from '@/lib/vpf-source'

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
    {
      name: 'vpfSync',
      type: 'group',
      label: 'Đồng bộ kết quả từ VPF',
      admin: {
        description:
          'Sáng thứ 3 hằng tuần hệ thống tự lấy kết quả các trận của CLB và bảng xếp hạng V.League 1 từ vpf.vn.',
      },
      fields: [
        {
          name: 'seasonUrl',
          type: 'text',
          label: 'Link mùa giải trên VPF',
          defaultValue: DEFAULT_VPF_SEASON_URL,
          validate: validateVpfSeasonUrl,
          admin: {
            description: 'Sang mùa mới thì đổi link này, VD: https://vpf.vn/season/v-league-2028/',
          },
        },
        {
          name: 'syncButton',
          type: 'ui',
          admin: { components: { Field: '@/components/admin/SyncVpfButton' } },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'lastRunAt',
              type: 'date',
              label: 'Lần chạy gần nhất',
              admin: {
                readOnly: true,
                width: '50%',
                date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
              },
            },
            {
              name: 'lastStatus',
              type: 'select',
              label: 'Kết quả',
              options: [
                { label: 'Thành công', value: 'success' },
                { label: 'Lỗi', value: 'error' },
              ],
              admin: { readOnly: true, width: '50%' },
            },
          ],
        },
        { name: 'lastMessage', type: 'textarea', label: 'Chi tiết', admin: { readOnly: true } },
      ],
    },
  ],
}
