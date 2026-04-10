/** @type {import('next').NextConfig} */

const wpHostname = process.env.NEXT_PUBLIC_WP_BASE
  ? new URL(process.env.NEXT_PUBLIC_WP_BASE).hostname
  : "localhost";

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: wpHostname, pathname: "/**" },
      { protocol: "https", hostname: `www.${wpHostname}`, pathname: "/**" },
    ], 
  },
};

export default nextConfig;
