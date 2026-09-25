import type { NextConfig } from "next";

// No remote image sources are in use — every image reference is a local
// file under public/. Re-add a remotePattern here if real, verified site
// photography is sourced from an external host in the future.
const nextConfig: NextConfig = {
  devIndicators: false
};

export default nextConfig;
