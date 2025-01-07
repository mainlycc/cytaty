"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Share2, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { toast } from 'sonner'
import { Input } from "./ui/input"
import Image from "next/image"

const MEMES_PER_PAGE = 50
const MAX_VISIBLE_PAGES = 5

type Like = {
  user_id: string;
  meme_id: number;
}

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  users: {
    username: string;
    avatar: string | null;
  } | null;
}

type Meme = {
  id: number;
  created_at: string;
  user_id: string;
  image_url: string;
  top_text: string;
  bottom_text: string;
  likes: Like[];
  comments: Comment[];
  top_position: { x: number; y: number };
  bottom_position: { x: number; y: number };
  hashtags: string[];
  users: {
    username: string;
    avatar: string | null;
  } | null;
}

type SortPeriod = 'all' | 'day' | 'week' | 'month'

type MemeWithLikes = Meme & {
  user_has_liked?: boolean;
  likes_count?: number;
}

export function MemeWall() {
  const [memes, setMemes] = useState<MemeWithLikes[]>([])
  const [newComment, setNewComment] = useState("")
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
      const { data: { session } } = await supabase.auth.getSession()
      
      let query = supabase
        .from('memes')
        .select(`
          *,
          users!inner (
            username,
            avatar
          ),
          likes!left (
            user_id
          ),
          comments!left (
            id,
            content,
            created_at,
            user_id,
            users:user_id (
              username,
              avatar
            )
          )
        `, { count: 'exact' })

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

      const memesWithLikes = data?.map(meme => ({
        ...meme,
        user_has_liked: meme.likes?.some((like: Like) => like.user_id === session?.user?.id),
        likes_count: meme.likes?.length || 0,
        comments: meme.comments || []
      })) || []

      setMemes(memesWithLikes)
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
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error('Musisz być zalogowany, aby polubić mem')
        return
      }

      const meme = memes.find(m => m.id === memeId)
      if (!meme) return

      if (meme.user_has_liked) {
        const { error: deleteLikeError } = await supabase
          .from('likes')
          .delete()
          .eq('meme_id', memeId)
          .eq('user_id', session.user.id)

        if (deleteLikeError) throw deleteLikeError

        setMemes(memes.map(m => 
          m.id === memeId 
            ? { 
                ...m, 
                likes_count: (m.likes_count || 0) - 1,
                user_has_liked: false,
                likes: m.likes.filter(like => like.user_id !== session.user.id)
              }
            : m
        ))
      } else {
        const { error: insertLikeError } = await supabase
          .from('likes')
          .insert([{ 
            meme_id: memeId, 
            user_id: session.user.id 
          }])

        if (insertLikeError) throw insertLikeError

        setMemes(memes.map(m => 
          m.id === memeId 
            ? { 
                ...m, 
                likes_count: (m.likes_count || 0) + 1,
                user_has_liked: true,
                likes: [...m.likes, { user_id: session.user.id, meme_id: memeId }]
              }
            : m
        ))
      }
    } catch (error) {
      console.error('Błąd podczas dodawania/usuwania polubienia:', error)
      toast.error('Wystąpił błąd podczas aktualizacji polubienia')
    }
  }

  const handleAddComment = async (memeId: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error('Musisz być zalogowany, aby dodać komentarz')
        return
      }

      if (!newComment.trim()) {
        toast.error('Komentarz nie może być pusty')
        return
      }

      const { data: commentData, error } = await supabase
        .from('comments')
        .insert([{
          content: newComment.trim(),
          meme_id: memeId,
          user_id: session.user.id
        }])
        .select(`
          *,
          users (
            username,
            avatar
          )
        `)
        .single()

      if (error) throw error

      setMemes(memes.map(meme => 
        meme.id === memeId 
          ? {
              ...meme,
              comments: [...(meme.comments || []), commentData]
            }
          : meme
      ))

      setNewComment("")
      toast.success('Komentarz został dodany')
    } catch (error) {
      console.error('Błąd podczas dodawania komentarza:', error)
      toast.error('Wystąpił błąd podczas dodawania komentarza')
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
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleSortChange('all')}
          className={`
            inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
            ${sortPeriod === 'all'
              ? 'bg-white text-black shadow-lg shadow-white/20' 
              : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
            }
          `}
          aria-label="Pokaż wszystkie memy"
        >
          Wszystkie
        </button>
        <button
          onClick={() => handleSortChange('day')}
          className={`
            inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
            ${sortPeriod === 'day'
              ? 'bg-white text-black shadow-lg shadow-white/20' 
              : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
            }
          `}
          aria-label="Pokaż memy z dzisiaj"
        >
          Dzisiaj
        </button>
        <button
          onClick={() => handleSortChange('week')}
          className={`
            inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
            ${sortPeriod === 'week'
              ? 'bg-white text-black shadow-lg shadow-white/20' 
              : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
            }
          `}
          aria-label="Pokaż memy z tego tygodnia"
        >
          W tym tygodniu
        </button>
        <button
          onClick={() => handleSortChange('month')}
          className={`
            inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
            ${sortPeriod === 'month'
              ? 'bg-white text-black shadow-lg shadow-white/20' 
              : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
            }
          `}
          aria-label="Pokaż memy z tego miesiąca"
        >
          W tym miesiącu
        </button>
      </div>
      
      {memes.map((meme) => (
        <Card 
          key={meme.id} 
          className="bg-black/50 backdrop-blur-sm border-zinc-800/80 hover:bg-black/60 transition-colors"
        >
          <CardContent className="p-6">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <Image
                src={meme.image_url}
                alt="Mem"
                className="w-full h-full object-contain"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {meme.top_text && (
                <div 
                  className="absolute text-2xl font-bold text-white uppercase whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${meme.top_position?.x || 0}%`,
                    top: `${meme.top_position?.y || 0}%`,
                    textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'
                  }}
                >
                  {meme.top_text}
                </div>
              )}
              {meme.bottom_text && (
                <div 
                  className="absolute text-2xl font-bold text-white uppercase whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${meme.bottom_position?.x || 0}%`,
                    top: `${meme.bottom_position?.y || 0}%`,
                    textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'
                  }}
                >
                  {meme.bottom_text}
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-white">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {meme.users?.avatar ? (
                    <img 
                      src={meme.users.avatar} 
                      alt={`Avatar ${meme.users.username}`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-xs text-zinc-400">
                        {meme.users?.username?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <span className="text-zinc-400">
                    Autor: {meme.users?.username || 'Anonim'}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-zinc-400">
                    Dodano: {formatDate(meme.created_at)}
                  </span>
                </div>
                {meme.hashtags && meme.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {meme.hashtags.map((tag, index) => (
                      <span 
                        key={`${meme.id}-${index}`}
                        className="text-sm bg-black/30 text-zinc-300 px-2 py-1 rounded-full border border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(meme.id)}
                  className={`flex items-center gap-2 ${
                    meme.user_has_liked 
                      ? 'text-red-500 hover:text-red-400' 
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 ${meme.user_has_liked ? 'fill-current' : ''}`} 
                  />
                  <span>{meme.likes_count || 0}</span>
                </Button>
                <Button 
                  variant="default"
                  size="sm"
                  className="bg-red-950/50 text-red-500 border border-red-800 hover:bg-red-900/50"
                  onClick={() => handleShare(meme)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Udostępnij
                </Button>
              </div>
            </div>

            <div className="mt-6 border-t border-zinc-800/80 pt-4">
              <h3 className="text-zinc-400 text-sm mb-4">
                Komentarze ({meme.comments?.length || 0})
              </h3>
              
              <div className="space-y-4">
                {meme.comments && meme.comments.length > 0 ? (
                  meme.comments.map((comment: Comment) => (
                    <div key={comment.id} className="flex gap-3">
                      {comment.users?.avatar ? (
                        <img 
                          src={comment.users.avatar} 
                          alt={`Avatar ${comment.users.username}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <span className="text-xs text-zinc-400">
                            {comment.users?.username?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-300 text-sm font-medium">
                            {comment.users?.username || 'Anonim'}
                          </span>
                          <span className="text-zinc-500 text-xs">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-zinc-300 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm">Brak komentarzy</p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Dodaj komentarz..."
                  className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleAddComment(meme.id)
                    }
                  }}
                />
                <Button
                  onClick={() => handleAddComment(meme.id)}
                  className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
                >
                  Dodaj
                </Button>
              </div>
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
            className="bg-black/30 text-white hover:bg-black/40 border-white/10"
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
                    : "bg-black/30 text-white hover:bg-black/40 border-white/10"
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
            className="bg-black/30 text-white hover:bg-black/40 border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 