/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Wyłącza błędy ESLint podczas budowania
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
