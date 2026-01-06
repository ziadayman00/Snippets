import type { NextConfig } from "next";

console.log("Next.js Loading - DATABASE_URL:", process.env.DATABASE_URL?.split("@")[1]);

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self' data:; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
