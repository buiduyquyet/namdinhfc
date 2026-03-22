import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'

import { Users } from './collections/Users'
import { Players } from './collections/Players'
import { News } from './collections/News'
import { Matches } from './collections/Matches'
import { Media } from './collections/Media'

import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Players, News, Matches, Media],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'a-very-secret-string-for-payload-3.0-namdinhfc',
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1/namdinh-fc',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
