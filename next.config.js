/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.29.245', 'localhost', '127.0.0.1', '0.0.0.0'],
  images: {
    /**
     * `unoptimized: true` used to be set here, which switched next/image off
     * entirely: no format conversion, no responsive srcset, no resizing. Every
     * visitor downloaded the full-size source — 5.2MB of images per page load,
     * 1.88MB of it the hero alone, the same bytes on a phone as on a 4K
     * display. Nothing needed it (there is no `output: 'export'`), so it's
     * gone.
     */
    formats: ['image/avif', 'image/webp'],
    // Sources are immutable URLs, so optimized variants can be cached hard.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
