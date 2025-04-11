import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://lastfm.freetls.fastly.net/**'),
    ]
  }
};

export default nextConfig;
