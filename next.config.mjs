/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination:
          'https://api.farcaster.xyz/miniapps/hosted-manifest/019f60a4-92b5-0e3b-2c37-c43964d69e49',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
