/** @type {import('next').NextConfig} */
const nextConfig = {
  // မူရင်းပါပြီးသား Build error ကျော်တဲ့ logic များ
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Vercel က Environment Variable ကို Client-side (Browser) မှာ သေချာဖတ်နိုင်အောင် ထပ်ဖြည့်ထားတာပါ
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
};

export default nextConfig;
