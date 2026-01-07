import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',        // 메인으로 들어오면
  //       destination: '/blog', // 블로그로 토스
  //       permanent: false,   // ★중요: 나중에 포트폴리오 넣으면 없앨 거니까 false(임시)로 설정
  //     },
  //   ];
  // },
};

export default withNextIntl(nextConfig);
