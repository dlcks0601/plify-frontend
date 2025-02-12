const nextConfig = {
  reactStrictMode: false, // React Strict Mode 비활성화
  swcMinify: true, // SWC를 사용한 코드 최적화
  experimental: {
    appDir: true, // Next.js 14 App Router 사용 시 필요
  },
};

export default nextConfig;
