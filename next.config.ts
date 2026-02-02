import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 experimental: {
 turbopackUseSystemTlsCerts: true,
 },
 async rewrites() {
 return [
 {
 source: "/api/:path*",
 destination: "http://localhost:8080/api/:path*",
 },
 ];
 },
};

export default nextConfig;
