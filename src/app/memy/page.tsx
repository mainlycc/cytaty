'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Facebook, Twitter, Instagram, Send, Heart, MessageCircle, Hash } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

// Przykładowe dane memów
const initialMemes = [
  { id: 1, imageUrl: '/placeholder.svg?height=600&width=800', likes: 120, comments: 15, author: "MemeKing", date: new Date('2023-05-20'), hashtags: ["funny", "relatable", "programming"] },
  { id: 2, imageUrl: '/placeholder.svg?height=600&width=800', likes: 80, comments: 8, author: "LolMaster", date: new Date('2023-05-19'), hashtags: ["meme", "joke", "weekend"] },
  { id: 3, imageUrl: '/placeholder.svg?height=600&width=800', likes: 200, comments: 25, author: "FunnyGuy", date: new Date('2023-05-18'), hashtags: ["lol", "humor", "viral"] },
]

type SortOption = 'today' | 'thisWeek' | 'thisMonth' | 'thisYear'

export default function MemeWall() {
  const [comments, setComments] = useState<{[key: number]: string}>({})
  const [sortBy, setSortBy] = useState<SortOption>('today')
  const [memes, setMemes] = useState(initialMemes)

  const handleCommentChange = (id: number, value: string) => {
    setComments(prev => ({ ...prev, [id]: value }))
  }

  const handleCommentSubmit = (id: number) => {
    console.log(`Submitted comment for meme ${id}: ${comments[id]}`)
    setComments(prev => ({ ...prev, [id]: '' }))
  }

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    const sortedMemes = [...initialMemes].sort((a, b) => {
      const now = new Date()
      const aDate = a.date
      const bDate = b.date

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
              <img src={meme.imageUrl} alt={`Meme by ${meme.author}`} className="w-full h-auto" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${meme.author}`} alt={meme.author} />
                      <AvatarFallback>{meme.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{meme.author}</span>
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
                  {meme.hashtags.map((tag, index) => (
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

