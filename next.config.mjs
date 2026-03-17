/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScript error တွေရှိရင်လည်း build ဆက်လုပ်ခိုင်းတာပါ
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint error တွေရှိရင်လည်း build ဆက်လုပ်ခိုင်းတာပါ
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
