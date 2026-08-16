import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Ảnh cầu thủ / tin tức đều upload qua Payload (/media) nên chưa cần domain ngoài.
    // Thêm host vào đây nếu dùng field "URL ảnh (link ngoài)".
    remotePatterns: [],
  },
};

export default withPayload(nextConfig);
