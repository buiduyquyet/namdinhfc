import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Người dùng', plural: 'Người dùng' },
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    description: 'Tài khoản đăng nhập vào trang quản trị.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tên hiển thị',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Vai trò',
      options: [
        { label: 'Quản trị viên', value: 'admin' },
        { label: 'Biên tập viên', value: 'editor' },
      ],
      defaultValue: 'admin',
    }
  ],
}
