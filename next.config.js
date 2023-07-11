/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['media-api.xogrp.com', 'images.pexels.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
