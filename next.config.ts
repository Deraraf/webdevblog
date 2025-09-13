import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // configure for external images from auth provider like Google or GitHub
  //The "images.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead

  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
