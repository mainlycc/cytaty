'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/app/components/ui/button"
import { QuoteCard } from "@/app/components/ui/quote-card"
import { Badge } from "@/app/components/ui/badge"
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
      <section className="relative overflow-hidden pt-8 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-4">
              <Badge 
                variant="custom" 
                className="px-4 py-1.5 text-xs font-medium bg-white/5 text-white/90 border-white/10"
              >
                + Dołącz do 70 000 pasjonatów kina
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent leading-tight md:leading-tight pb-2">
              Filmowe słowa, które żyją dłużej
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-12">
              Dołącz do filmowej społeczności! Twórz memy, dziel się cytatami i sprawdzaj swoją wiedzę w quizach. Odkryj magię kina razem z nami!
            </p>
            <Link href="/auth/login">
              <Button 
                variant="outline"
                className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50 mt-12 mb-16 md:mb-0"
              >
                Dołącz do nas!
              </Button>
            </Link>
          </div>

          <div className="relative max-w-4xl mx-auto mt-8 md:mt-0">
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
      
      <div className="relative z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
        <BentoGrid />
      </div>
    </>
  )
}
