/** @type {import('next').NextConfig} */

// No WP hostname here on purpose: all WP media is served through the same-origin
// proxy at /api/media/... (see src/lib/mediaProxy.js), so next/image never needs
// to load directly from the WP origin. See docs/wp-masking.md.
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
};

export default nextConfig;
