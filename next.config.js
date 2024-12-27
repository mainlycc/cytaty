/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'xwifzcgbtreueptsglqk.supabase.co', // Twoja domena Supabase
      'image.tmdb.org', // Dodaj domenę TMDB
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xwifzcgbtreueptsglqk.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
}

module.exports = nextConfig 