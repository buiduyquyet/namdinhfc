import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Thêm host vào đây nếu dùng field "URL ảnh (link ngoài)".
    remotePatterns: [
      // Ảnh upload qua Payload khi deploy — lưu ở Vercel Blob
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
};

export default withPayload(nextConfig);
