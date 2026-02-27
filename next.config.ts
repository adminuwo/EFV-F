import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/index.html' },
      { source: '/marketplace', destination: '/marketplace.html' },
      { source: '/profile', destination: '/profile.html' },
      { source: '/checkout', destination: '/checkout.html' },
      { source: '/admin', destination: '/admin-dashboard.html' },
      { source: '/tracking', destination: '/tracking.html' },
      { source: '/about', destination: '/about.html' },
      { source: '/contact', destination: '/contact.html' }
    ];
  },
};

export default nextConfig;
