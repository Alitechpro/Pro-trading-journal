import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  onDemandEntries: {
    // This stops Next.js from trying to prerender _not-found during build
    maxInactiveAge: 1000 * 60 * 60,
  },
  // Or the nuclear option (don’t do this in production)
  // eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
