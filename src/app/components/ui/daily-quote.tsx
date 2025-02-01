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
      const today = new Date().toISOString().split('T')[0]
      const savedQuote = localStorage.getItem(`dailyQuote_${today}`)
      
      if (savedQuote) {
        setQuote(JSON.parse(savedQuote))
        return
      }

      const { data: quotes, error } = await supabase
        .from('quotes')
        .select('id, quote, movie, year')

      if (error) {
        console.error('Błąd podczas pobierania cytatów:', error)
        return
      }

      if (quotes && quotes.length > 0) {
        const seed = parseInt(today.replace(/-/g, ''))
        const randomIndex = seed % quotes.length
        const dailyQuote = quotes[randomIndex]

        localStorage.setItem(`dailyQuote_${today}`, JSON.stringify(dailyQuote))
        setQuote(dailyQuote)
      }
    }

    getDailyQuote()
  }, [supabase])

  if (!quote) return null

  return (
    <div className="relative h-[400px] w-full flex items-center justify-center">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8">
        <div className="bg-black/40 rounded-xl p-6 w-full max-w-2xl backdrop-blur-sm">
          <Quote className="w-8 h-8 text-blue-500 mx-auto mb-4" />
          <p className="text-xl md:text-2xl font-serif italic text-white mb-4 leading-relaxed">
            &ldquo;{quote.quote}&rdquo;
          </p>
          <p className="text-sm text-zinc-300">
            {quote.movie} ({quote.year})
          </p>
        </div>
      </div>
    </div>
  )
}

export default DailyQuote 