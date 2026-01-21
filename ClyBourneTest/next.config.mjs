/** @type {import('next').NextConfig} */
const isGithubPages = process.env.DEPLOY_TARGET === 'github';

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    turbo: true, // ⚡ HUGE speed improvement for dev builds
  },
  images: {
    unoptimized: true, // ✔ You already added this — keeps image builds fast
  },
  basePath: isGithubPages ? '/Atif-work' : '',
  assetPrefix: isGithubPages ? '/Atif-work/' : '',
  typescript: {
    ignoreBuildErrors: true, // ⚡ Optional: faster dev builds
  },
};
