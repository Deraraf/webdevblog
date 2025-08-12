import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // configure for external images from auth provider like Google or GitHub
  images: {
    domains: [" lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
};

export default nextConfig;
