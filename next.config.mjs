/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Error ရှိလည်း Build လုပ်ခိုင်းတာပါ
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
