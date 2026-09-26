import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Thêm host vào đây nếu dùng field "URL ảnh (link ngoài)".
    remotePatterns: [
      // Ảnh upload qua Payload khi deploy — lưu ở Vercel Blob
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      // Logo các CLB lấy từ file Excel của VPF (field "URL logo" trong collection Đội bóng)
      { protocol: 'https', hostname: 'vpf.vn' },
      { protocol: 'https', hostname: 'www.vpf.vn' },
    ],
  },
};

export default withPayload(nextConfig);
