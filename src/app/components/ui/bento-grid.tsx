'use client'

import { Film, Trophy, ThumbsUp, Clapperboard, CalendarDays, Quote } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import UpcomingMovies from "./upcoming-movies"
import DailyQuote from "./daily-quote"

interface TopMeme {
  id: string
  image_url: string
  top_text: string | null
  bottom_text: string | null
}

interface Card {
  title: string
  description: string
  icon: React.ReactNode
  link?: string
  color: string
  className?: string
  content?: React.ReactNode
}

const BentoGrid = () => {
  const [topMeme, setTopMeme] = useState<TopMeme | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchTopMeme = async () => {
      const { data, error } = await supabase
        .from('memes')
        .select('id, image_url, top_text, bottom_text')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error('Błąd podczas pobierania mema:', error)
      } else if (data) {
        setTopMeme(data)
      }
    }

    fetchTopMeme()
  }, [supabase])

  const cards: Card[] = [
    {
      title: "Memy",
      description: "Zobacz i twórz memy filmowe",
      icon: <ThumbsUp className="w-6 h-6 text-green-500" />,
      link: "/memy",
      color: "from-green-500/20 to-green-500/0",
      className: "md:col-span-3 lg:col-span-2",
      content: topMeme && (
        <div className="mt-2 relative w-full h-[400px] rounded-lg overflow-hidden">
          <Image
            src={topMeme.image_url}
            alt={topMeme.top_text || topMeme.bottom_text || 'Mem filmowy'}
            fill
            className="object-contain bg-black/40"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )
    },
    {
      title: "Premiery",
      description: "Sprawdź nadchodzące premiery kinowe",
      icon: <CalendarDays className="w-6 h-6 text-purple-500" />,
      color: "from-purple-500/20 to-purple-500/0",
      className: "md:col-span-3 lg:col-span-2",
      content: <UpcomingMovies />,
      link: undefined
    },
    {
      title: "Cytat Dnia",
      description: "Kultowe cytaty z filmów",
      icon: <Quote className="w-6 h-6 text-blue-500" />,
      color: "from-blue-500/20 to-blue-500/0",
      className: "md:col-span-3 lg:col-span-2",
      content: <DailyQuote />
    },
    {
      title: "Quizy Filmowe",
      description: "Sprawdź swoją wiedzę o filmach w naszych quizach",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      className: "md:col-span-2",
      link: "/quizy",
      color: "from-yellow-500/20 to-yellow-500/0"
    },
    {
      title: "Baza Filmów",
      description: "Przeglądaj naszą bazę filmów i seriali",
      icon: <Film className="w-6 h-6 text-red-500" />,
      className: "md:col-span-2",
      link: "/filmy",
      color: "from-red-500/20 to-red-500/0"
    },
    {
      title: "Nowości",
      description: "Bądź na bieżąco z filmowymi premierami",
      icon: <Clapperboard className="w-6 h-6 text-orange-500" />,
      link: "/nowosci",
      color: "from-orange-500/20 to-orange-500/0",
      className: "md:col-span-2"
    }
  ]

  return (
    <div className="py-4">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Odkryj więcej
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {cards.map((card, i) => (
            <div key={i} className={`${card.className || 'md:col-span-2'} last:border-b-0`}>
              {card.link ? (
                <Link 
                  href={card.link}
                  className="block transform transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="group relative overflow-hidden rounded-xl bg-black/20 hover:border-white/20 transition-all duration-300"
                  >
                    <div 
                      className={`absolute inset-0 bg-gradient-to-b ${card.color} transition-opacity duration-300 group-hover:opacity-70 opacity-0`} 
                    />
                    <div className="relative z-10">
                      {card.content}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <div className="flex items-center gap-4 mb-1">
                          {card.icon}
                          <h3 className="text-xl font-semibold text-zinc-100">
                            {card.title}
                          </h3>
                        </div>
                        <p className="text-sm text-zinc-400">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  className="group relative overflow-hidden rounded-xl bg-black/20 hover:border-white/20 transition-all duration-300"
                >
                  <div 
                    className={`absolute inset-0 bg-gradient-to-b ${card.color} transition-opacity duration-300 group-hover:opacity-70 opacity-0`} 
                  />
                  <div className="relative z-10">
                    {card.content}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <div className="flex items-center gap-4 mb-1">
                        {card.icon}
                        <h3 className="text-xl font-semibold text-zinc-100">
                          {card.title}
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-400">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BentoGrid 