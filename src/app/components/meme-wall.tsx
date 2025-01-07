"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Share2, ChevronLeft, ChevronRight, Heart } from "lucide-react"

const MEMES_PER_PAGE = 50
const MAX_VISIBLE_PAGES = 5

type Meme = {
  id: number
  created_at: string
  user_id: string
  image_url: string
  top_text: string
  bottom_text: string
  likes: number
  top_position: { x: number; y: number }
  bottom_position: { x: number; y: number }
  hashtags: string[]
  user: {
    username: string
  }
}

type SortPeriod = 'all' | 'day' | 'week' | 'month'

export function MemeWall() {
  const [memes, setMemes] = useState<Meme[]>([])
  const [sortPeriod, setSortPeriod] = useState<SortPeriod>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const supabase = createClientComponentClient()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    const fetchMemes = async () => {
      let query = supabase
        .from('memes')
        .select('*', { count: 'exact' })

      if (sortPeriod !== 'all') {
        const now = new Date()
        let startDate = new Date()

        switch (sortPeriod) {
          case 'day':
            startDate.setDate(now.getDate() - 1)
            break
          case 'week':
            startDate.setDate(now.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(now.getMonth() - 1)
            break
        }

        query = query.gte('created_at', startDate.toISOString())
      }

      const from = (currentPage - 1) * MEMES_PER_PAGE
      const to = from + MEMES_PER_PAGE - 1

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Błąd podczas pobierania memów:', error)
        return
      }

      setMemes(data || [])
      setTotalCount(count || 0)
    }

    fetchMemes()
  }, [supabase, sortPeriod, currentPage])

  const handleSortChange = (value: SortPeriod) => {
    setSortPeriod(value)
    setCurrentPage(1)
  }

  const handleShare = async (meme: Meme) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Zobacz tego mema!',
          text: `${meme.top_text} ${meme.bottom_text}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Błąd podczas udostępniania:', error)
      }
    } else {
      alert('Twoja przeglądarka nie wspiera funkcji udostępniania')
    }
  }

  const handleLike = async (memeId: number) => {
    try {
      const meme = memes.find(m => m.id === memeId)
      if (!meme) return

      const { error } = await supabase
        .from('memes')
        .update({ likes: (meme.likes || 0) + 1 })
        .eq('id', memeId)

      if (error) throw error

      setMemes(memes.map(m => 
        m.id === memeId 
          ? { ...m, likes: (m.likes || 0) + 1 }
          : m
      ))
    } catch (error) {
      console.error('Błąd podczas dodawania polubienia:', error)
    }
  }

  const totalPages = Math.ceil(totalCount / MEMES_PER_PAGE)

  const generatePaginationNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)
    
    let startPage = Math.max(2, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2))
    let endPage = Math.min(totalPages - 1, startPage + MAX_VISIBLE_PAGES - 3)
    startPage = Math.max(2, endPage - (MAX_VISIBLE_PAGES - 3))

    if (startPage > 2) pages.push('...')
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages - 1) pages.push('...')
    
    pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex gap-2">
        <Button
          variant={sortPeriod === 'all' ? 'default' : 'outline'}
          onClick={() => handleSortChange('all')}
          className={`${
            sortPeriod === 'all'
              ? "bg-white text-zinc-950 hover:bg-white/90"
              : "bg-black/50 backdrop-blur-sm hover:bg-zinc-800"
          }`}
        >
          Wszystkie
        </Button>
        <Button
          variant={sortPeriod === 'day' ? 'default' : 'outline'}
          onClick={() => handleSortChange('day')}
          className={`${
            sortPeriod === 'day'
              ? "bg-white text-zinc-900 hover:bg-white/90"
              : "bg-black/100 backdrop-blur-sm hover:bg-zinc-200"
          }`}
        >
          Dzisiaj
        </Button>
        <Button
          variant={sortPeriod === 'week' ? 'default' : 'outline'}
          onClick={() => handleSortChange('week')}
          className={`${
            sortPeriod === 'week'
              ? "bg-white text-black hover:bg-white/90"
              : "bg-black/50 backdrop-blur-sm hover:bg-zinc-800"
          }`}
        >
          W tym tygodniu
        </Button>
        <Button
          variant={sortPeriod === 'month' ? 'default' : 'outline'}
          onClick={() => handleSortChange('month')}
          className={`${
            sortPeriod === 'month'
              ? "bg-white text-black hover:bg-white/90"
              : "bg-black/50 backdrop-blur-sm hover:bg-zinc-800"
          }`}
        >
          W tym miesiącu
        </Button>
      </div>
      
      {memes.map((meme) => (
        <Card key={meme.id} className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800">
          <CardContent className="p-6">
            <div className="relative aspect-[4/3]">
              <img
                src={meme.image_url}
                alt="Mem"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0">
                {meme.top_text && (
                  <h2 
                    className="text-2xl md:text-3xl font-bold uppercase text-center absolute text-white [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]"
                    style={{
                      left: meme.top_position?.x || '50%',
                      top: meme.top_position?.y || '10%',
                      transform: meme.top_position ? 'none' : 'translateX(-50%)'
                    }}
                  >
                    {meme.top_text}
                  </h2>
                )}
                {meme.bottom_text && (
                  <h2 
                    className="text-2xl md:text-3xl font-bold uppercase text-center absolute text-white [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]"
                    style={{
                      left: meme.bottom_position?.x || '50%',
                      bottom: meme.bottom_position?.y || '10%',
                      transform: meme.bottom_position ? 'none' : 'translateX(-50%)'
                    }}
                  >
                    {meme.bottom_text}
                  </h2>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-white">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span>Liczba polubień: {meme.likes || 0}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:text-red-500 hover:bg-zinc-800 p-2"
                    onClick={() => handleLike(meme.id)}
                    aria-label="Polub mema"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">
                    Autor: {meme.user?.username || 'Anonim'}
                  </span>
                  <span className="text-zinc-400">
                    Dodano: {formatDate(meme.created_at)}
                  </span>
                </div>
                {meme.hashtags && meme.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {meme.hashtags.map((tag, index) => (
                      <span 
                        key={`${meme.id}-${index}`}
                        className="text-sm bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"
                onClick={() => handleShare(meme)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Udostępnij
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="bg-black/50 backdrop-blur-sm hover:bg-zinc-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {generatePaginationNumbers().map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`dots-${index}`} className="px-2 text-zinc-400">
                ...
              </span>
            ) : (
              <Button
                key={`page-${pageNum}`}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum as number)}
                className={`min-w-[40px] ${
                  currentPage === pageNum 
                    ? "bg-white text-black hover:bg-white/90" 
                    : "bg-black/50 backdrop-blur-sm hover:bg-zinc-800"
                }`}
              >
                {pageNum}
              </Button>
            )
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="bg-black/50 backdrop-blur-sm hover:bg-zinc-800"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 