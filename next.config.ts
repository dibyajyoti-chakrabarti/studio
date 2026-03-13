import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "instasize.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'mechhub-product-images.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },

    ],
    domains: [
      "mechhub-product-images.s3.eu-north-1.amazonaws.com"
    ]
  },

};

export default withContentlayer(nextConfig);
