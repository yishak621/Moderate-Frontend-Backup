import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "api.moderatetech.co.uk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.moderatetech.co.uk",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
