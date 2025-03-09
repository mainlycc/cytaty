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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log("Status sesji:", !!session)
        setIsLoggedIn(!!session)
        
        if (session?.user) {
          console.log("ID użytkownika:", session.user.id)
          const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('id', session.user.id)
            .single()
          
          if (error) {
            console.error("Błąd pobierania nazwy użytkownika:", error)
          }
          
          if (data?.username) {
            console.log("Nazwa użytkownika:", data.username)
            setUserName(data.username)
          }
        }
      } catch (error) {
        console.error("Błąd podczas sprawdzania sesji:", error)
      }
    }

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

    checkSession()
    fetchQuotes()
    
    // Nasłuchiwanie zmian w sesji użytkownika
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Zmiana stanu autoryzacji:", event)
        setIsLoggedIn(!!session)
        
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('username')
            .eq('id', session.user.id)
            .single()
          
          if (data?.username) {
            setUserName(data.username)
          }
        } else {
          setUserName("")
        }
      }
    )
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

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
            <div className="flex justify-center mb-2">
              <Badge 
                variant="custom" 
                className="px-4 py-1.5 text-xs font-medium bg-white/5 text-white/90 border-white/10"
              >
                + Dołącz do 70 000 pasjonatów kina
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent leading-tight md:leading-tight">
              Filmowe <span className="italic">słowa</span>, które żyją dłużej
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Dołącz do filmowej społeczności! Twórz memy, dziel się cytatami i sprawdzaj swoją wiedzę w quizach. Odkryj magię kina razem z nami!
            </p>
            <div className="mt-16">
              {isLoggedIn ? (
                <Button 
                  variant="outline"
                  disabled
                  className="relative px-8 py-3 text-lg font-semibold 
                  bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 
                  text-white border-emerald-700 
                  opacity-90 cursor-default
                  transition-all duration-300 ease-out
                  shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {userName ? `Witaj, ${userName}!` : "Witaj!"}
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                </Button>
              ) : (
                <Link href="/auth/login">
                  <Button 
                    variant="outline"
                    className="relative px-8 py-3 text-lg font-semibold 
                    bg-gradient-to-r from-red-900 via-red-800 to-red-900 
                    text-white border-red-700 
                    hover:border-red-600 hover:from-red-800 hover:via-red-700 hover:to-red-800 
                    transition-all duration-300 ease-out
                    shadow-[0_0_10px_rgba(220,38,38,0.15)] 
                    hover:shadow-[0_0_15px_rgba(220,38,38,0.25)]
                    group"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Dołącz do nas!
                      <svg 
                        className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto mt-24">
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
