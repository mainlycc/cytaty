'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { QuoteCard } from '@/components/ui/quote-card'
import { NavMenu } from '@/components/ui/nav-menu'

const quotes = [
  {
    quote: "I'm going to make him an offer he can't refuse.",
    movie: "The Godfather",
    year: "1972"
  },
  {
    quote: "Here's looking at you, kid.",
    movie: "Casablanca",
    year: "1942"
  },
  {
    quote: "May the Force be with you.",
    movie: "Star Wars",
    year: "1977"
  }
]

export default function Hero() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <NavMenu />
      <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-black via-black to-red-950 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
              Cytaty z filmów
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              
Twoje miejsce wśród kinomaniaków! Dodawaj memy, cytuj kultowe kwestie i rywalizuj z innymi fanami filmów w emocjonujących quizach. Pokaż, kto naprawdę zna się na kinie!
            </p>
            <Button 
              variant="outline"
              className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
            >
              Dołącz do nas!
            </Button>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="transform -rotate-6">
                <QuoteCard {...quotes[(currentQuote + 2) % quotes.length]} />
              </div>
              <div className="transform translate-y-4">
                <QuoteCard {...quotes[currentQuote]} />
              </div>
              <div className="transform rotate-6">
                <QuoteCard {...quotes[(currentQuote + 1) % quotes.length]} />
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-zinc-500 text-sm font-medium mb-4">FEATURED IN</h2>
            <div className="flex justify-center gap-8 opacity-50">
              <div className="w-24 h-8 bg-zinc-800 rounded" />
              <div className="w-24 h-8 bg-zinc-800 rounded" />
              <div className="w-24 h-8 bg-zinc-800 rounded" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

