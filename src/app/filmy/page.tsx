import { MovieGrid } from '@/app/components/ui/movie-grid'

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Popularne filmy</h1>
        <MovieGrid />
      </div>
    </main>
  )
}

