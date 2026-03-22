import { RootPage } from '@payloadcms/next/views'
import config from '@/payload.config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export default function Page({ params, searchParams }: Args) {
  return <RootPage config={config} importMap={importMap} params={params} searchParams={searchParams} />
}
