/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'xwifzcgbtreueptsglqk.supabase.co', // Twoja domena Supabase
      'image.tmdb.org', // Dodaj domenę TMDB
      'i.imgflip.com', // Domena z szablonami memów
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
      {
        protocol: 'https',
        hostname: 'i.imgflip.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 