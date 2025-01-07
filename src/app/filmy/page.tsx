import { MovieGrid } from '@/app/components/ui/movie-grid'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-800/70" />
      
      <main className="container mx-auto py-8 relative">
        <div className="space-y-6">
          <MovieGrid />
        </div>
      </main>
    </div>
  )
}

