import { Metadata } from 'next'
import { MovieTrailers } from '@/app/components/ui/movie-trailers'

export const metadata: Metadata = {
  title: 'Najnowsze zwiastuny filmowe | Cytaty',
  description: 'Przeglądaj najnowsze zwiastuny filmowe nadchodzących premier kinowych'
}

export default function TrailersPage() {
  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-800/70" />
      
      <main className="container mx-auto py-8 relative">
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Najnowsze zwiastuny</h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Odkryj najnowsze zwiastuny nadchodzących premier kinowych. Bądź na bieżąco 
              z najgorętszymi tytułami, które wkrótce pojawią się na ekranach kin.
            </p>
          </div>
          
          <MovieTrailers />
        </div>
      </main>
    </div>
  )
} 