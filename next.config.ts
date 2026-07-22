import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@pinecone-database/pinecone"],
    
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  turbopack: {
    resolveAlias: {
      canvas: "./empty-module.ts",  // ← replaces webpack canvas alias
    },
  },
};

export default nextConfig;
