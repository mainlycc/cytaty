'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/app/components/ui/button"
import { QuoteCard } from "@/app/components/ui/quote-card"
import BentoGrid from "./bento-grid"

import Link from "next/link"

interface Quote {
  id: string
  quote: string
  movie: string
  year: string
}

export default function Hero() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [currentQuote, setCurrentQuote] = useState(0)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchQuotes() {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
      
      if (error) {
        console.error('Błąd podczas pobierania cytatów:', error)
        return
      }

      if (data) {
        // Losowe przemieszanie cytatów
        const shuffledQuotes = data.sort(() => Math.random() - 0.5)
        setQuotes(shuffledQuotes)
      }
    }

    fetchQuotes()
  }, [])

  useEffect(() => {
    if (quotes.length === 0) return

    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [quotes.length])

  if (quotes.length === 0) {
    return <div>Ładowanie cytatów...</div>
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center space-y-10 mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
              Cytaty z filmów
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-16">
              Twoje miejsce wśród kinomaniaków! Dodawaj memy, cytuj kultowe kwestie i rywalizuj z innymi fanami filmów w emocjonujących quizach. Pokaż, kto naprawdę zna się na kinie!
            </p>
            <Link href="/auth/register">
              <Button 
                variant="outline"
                className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50 mt-16"
              >
                Dołącz do nas!
              </Button>
            </Link>
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
        </div>
      </section>
      
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
        <BentoGrid />
      </div>
    </>
  )
}

