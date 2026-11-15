import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The separate cart/checkout step was removed; old links go straight to the order form.
      { source: '/checkout', destination: '/confirm-order', permanent: true },
    ]
  },
};

export default nextConfig;
