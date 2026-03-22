import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
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
        { label: 'Admin', value: 'admin' },
        { label: 'Biên tập viên', value: 'editor' },
      ],
      defaultValue: 'admin',
    }
  ],
}
