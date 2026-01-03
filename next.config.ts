import type { NextConfig } from "next";

console.log("Next.js Loading - DATABASE_URL:", process.env.DATABASE_URL?.split("@")[1]);

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
