import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
