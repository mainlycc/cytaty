'use client'

import { useEffect, useState } from "react"
import { Quote } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface DailyQuote {
  id: string
  quote: string
  movie: string
  year: string
}

const DailyQuote = () => {
  const [quote, setQuote] = useState<DailyQuote | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getDailyQuote = async () => {
      // Pobierz datę jako string YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0]
      
      // Sprawdź czy mamy już zapisany cytat na dziś w localStorage
      const savedQuote = localStorage.getItem(`dailyQuote_${today}`)
      
      if (savedQuote) {
        setQuote(JSON.parse(savedQuote))
        return
      }

      // Jeśli nie ma cytatu na dziś, pobierz wszystkie cytaty
      const { data: quotes, error } = await supabase
        .from('quotes')
        .select('id, quote, movie, year')

      if (error) {
        console.error('Błąd podczas pobierania cytatów:', error)
        return
      }

      if (quotes && quotes.length > 0) {
        // Użyj daty jako seed dla pseudolosowego wyboru
        const seed = parseInt(today.replace(/-/g, ''))
        const randomIndex = seed % quotes.length
        const dailyQuote = quotes[randomIndex]

        // Zapisz wybrany cytat w localStorage
        localStorage.setItem(`dailyQuote_${today}`, JSON.stringify(dailyQuote))
        setQuote(dailyQuote)
      }
    }

    getDailyQuote()
  }, [supabase])

  if (!quote) return null

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <Quote className="w-8 h-8 text-blue-500 mb-4" />
      <p className="text-xl md:text-2xl font-serif italic text-white mb-4">
        "{quote.quote}"
      </p>
      <p className="text-sm text-zinc-400">
        {quote.movie} ({quote.year})
      </p>
    </div>
  )
}

export default DailyQuote 