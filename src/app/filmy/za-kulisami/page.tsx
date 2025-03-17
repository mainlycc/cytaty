import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Za kulisami filmów | Cytaty',
  description: 'Odkryj materiały zza kulis z planów filmowych, wywiady z aktorami i informacje o produkcji.'
}

export default function BehindTheScenesPage() {
  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-800/70" />
      
      <main className="container mx-auto py-8 relative">
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Za kulisami</h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Odkryj fascynujące materiały zza kulis z planów filmowych, wywiady z aktorami 
              i ciekawostki z produkcji najpopularniejszych filmów.
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-8 rounded-xl">
            <div className="text-center text-white">
              <p className="text-xl">Strona w przygotowaniu</p>
              <p className="mt-4 text-white/70">
                Wkrótce dodamy tutaj materiały zza kulis z planów filmowych, wywiady z aktorami i informacje o produkcji.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 