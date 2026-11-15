import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The separate cart/checkout step was removed; old links go straight to the order form.
      { source: '/checkout', destination: '/confirm-order', permanent: true },
      // The order-details form now lives at /create-order (linked from the footer button)
      { source: '/post-order', destination: '/create-order', permanent: true },
    ]
  },
};

export default nextConfig;
