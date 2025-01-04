'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Facebook, Twitter, Instagram, Send, Heart, MessageCircle, Hash } from 'lucide-react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

// Interfejsy dla danych z Supabase
interface DBUser {
  id: string;
  email: string | null;
  name: string | null;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
  points: number | null;
}

// Interfejs dla surowych danych z Supabase
interface RawMeme {
  id: string;
  user_id: string;
  image_url: string;
  top_text: string | null;
  bottom_text: string | null;
  created_at: string;
  hashtags: string[] | null;
  comments: number | null;
  likes: number | null;
  top_postion: any;
  bottom_position: any;
  users: DBUser[];
}

// Interfejs dla przetworzonych danych
interface Meme {
  id: string;
  user_id: string;
  image_url: string;
  top_text: string;
  bottom_text: string;
  created_at: string;
  hashtags: string[];
  comments: number;
  likes: number;
  top_postion: any;
  bottom_position: any;
  user: DBUser | null;
}

type SortOption = 'today' | 'thisWeek' | 'thisMonth' | 'thisYear'

export default function MemeWall() {
  const { t } = useTranslation()
  const [comments, setComments] = useState<{[key: string]: string}>({})
  const [memes, setMemes] = useState<Meme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data: rawData, error: memesError } = await supabase
          .from('memes')
          .select(`
            id,
            user_id,
            image_url,
            top_text,
            bottom_text,
            created_at,
            hashtags,
            comments,
            likes,
            top_postion,
            bottom_position,
            users (
              id,
              email,
              name,
              username,
              avatar,
              bio,
              website,
              twitter,
              instagram,
              created_at,
              updated_at,
              points
            )
          `)
          .order('created_at', { ascending: false })

        if (memesError) {
          console.error('Error fetching memes:', memesError)
          throw memesError
        }

        console.log('Fetched raw data:', rawData)

        // Mapuj dane do odpowiedniego formatu
        const processedMemes = (rawData as RawMeme[]).map(meme => ({
          ...meme,
          hashtags: meme.hashtags || [],
          comments: meme.comments || 0,
          likes: meme.likes || 0,
          top_text: meme.top_text || '',
          bottom_text: meme.bottom_text || '',
          user: Array.isArray(meme.users) && meme.users.length > 0 ? meme.users[0] : null,
          users: undefined // Usuwamy pole users
        })) as Meme[]

        console.log('Processed memes:', processedMemes)
        setMemes(processedMemes)

      } catch (error) {
        console.error('Szczegóły błędu:', error)
        setError('Nie udało się załadować memów. Spróbuj ponownie później.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemes()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    )
  }

  const handleCommentChange = (id: string, value: string) => {
    setComments(prev => ({ ...prev, [id]: value }))
  }

  const handleCommentSubmit = (id: string) => {
    console.log(`Submitted comment for meme ${id}: ${comments[id]}`)
    setComments(prev => ({ ...prev, [id]: '' }))
  }

  const handleSortChange = (value: SortOption) => {
    const sortedMemes = [...memes].sort((a, b) => {
      const now = new Date()
      const aDate = new Date(a.created_at)
      const bDate = new Date(b.created_at)

      switch (value) {
        case 'today':
          return aDate.getDate() === now.getDate() ? b.likes - a.likes : 0
        case 'thisWeek':
          return aDate.getTime() >= now.getTime() - 7 * 24 * 60 * 60 * 1000 ? b.likes - a.likes : 0
        case 'thisMonth':
          return aDate.getMonth() === now.getMonth() ? b.likes - a.likes : 0
        case 'thisYear':
          return aDate.getFullYear() === now.getFullYear() ? b.likes - a.likes : 0
        default:
          return 0
      }
    })
    setMemes(sortedMemes)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Ściana Memów</h1>
      <div className="max-w-3xl mx-auto mb-8 flex justify-end">
        <Select onValueChange={handleSortChange} defaultValue="today">
          <SelectTrigger className="w-48 bg-card border-border">
            <SelectValue placeholder="Sortuj" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="today">Dzisiaj</SelectItem>
            <SelectItem value="thisWeek">W tym tygodniu</SelectItem>
            <SelectItem value="thisMonth">W tym miesiącu</SelectItem>
            <SelectItem value="thisYear">W tym roku</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="max-w-3xl mx-auto space-y-8">
        {memes.map((meme) => (
          <Card key={meme.id} className="bg-card border-border">
            <CardContent className="p-0">
              <img 
                src={meme.image_url} 
                alt={`Mem by ${meme.user?.name || meme.user?.username || 'Anonymous'}`} 
                className="w-full h-auto" 
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={meme.user?.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${meme.user?.name || 'Anon'}`}
                        alt={meme.user?.name || meme.user?.username || 'Anonymous'} 
                      />
                      <AvatarFallback>
                        {(meme.user?.name || meme.user?.username || 'A').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">
                      {meme.user?.name || meme.user?.username || 'Anonymous'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" className="text-rose-500 hover:text-rose-400">
                      <Heart className="h-5 w-5 mr-1" />
                      <span className="text-sm">{meme.likes}</span>
                    </Button>
                    <Button variant="ghost" className="text-emerald-500 hover:text-emerald-400">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm">{meme.comments}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {meme.hashtags.map((tag: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-secondary hover:bg-muted">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-secondary hover:bg-muted">
                    <Twitter className="h-4 w-4 mr-2" />
                    X
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-secondary hover:bg-muted">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-secondary p-4">
              <div className="flex items-center space-x-2 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@username" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <Input
                  className="flex-grow bg-muted border-input text-foreground text-lg"
                  placeholder="Dodaj komentarz..."
                  value={comments[meme.id] || ''}
                  onChange={(e) => handleCommentChange(meme.id, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => handleCommentSubmit(meme.id)}>
                  <Send className="h-8 w-8" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

