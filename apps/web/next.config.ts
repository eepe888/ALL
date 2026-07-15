import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets the phone reach the dev server over the LAN during manual
  // responsive-design testing; Next.js blocks cross-origin dev requests
  // by default. Update this if the machine's local IP changes.
  allowedDevOrigins: ["192.168.10.108"],
};

export default nextConfig;
