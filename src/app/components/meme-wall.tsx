"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"

interface MemeWallProps {
  memes: any[]
  currentUser: any
}

export function MemeWall({ memes, currentUser }: MemeWallProps) {
  const [comments, setComments] = useState<{ [key: string]: string }>({})
  const supabase = createClientComponentClient()

  const handleLike = async (memeId: string) => {
    if (!currentUser) {
      toast.error('Musisz być zalogowany, aby polubić mem')
      return
    }

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select()
        .eq('meme_id', memeId)
        .eq('user_id', currentUser.id)
        .single()

      if (existingLike) {
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)
        toast.success('Usunięto polubienie')
      } else {
        await supabase
          .from('likes')
          .insert({ meme_id: memeId, user_id: currentUser.id })
        toast.success('Polubiono mem!')
      }
    } catch (error) {
      toast.error('Wystąpił błąd')
    }
  }

  const handleComment = async (memeId: string) => {
    if (!currentUser) {
      toast.error('Musisz być zalogowany, aby dodać komentarz')
      return
    }

    const comment = comments[memeId]
    if (!comment?.trim()) return

    try {
      await supabase
        .from('comments')
        .insert({
          meme_id: memeId,
          user_id: currentUser.id,
          content: comment
        })

      setComments(prev => ({ ...prev, [memeId]: '' }))
      toast.success('Dodano komentarz!')
    } catch (error) {
      toast.error('Wystąpił błąd podczas dodawania komentarza')
    }
  }

  return (
    <div className="space-y-8">
      {memes?.map((meme) => (
        <Card key={meme.id} className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
          <CardContent className="p-6 space-y-4">
            {/* Nagłówek mema */}
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={meme.users?.avatar} />
                <AvatarFallback>{meme.users?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-zinc-100">{meme.users?.name}</p>
                <p className="text-sm text-zinc-400">@{meme.users?.username}</p>
              </div>
            </div>

            {/* Mem */}
            <div className="relative">
              <img
                src={meme.image_url}
                alt="Mem"
                className="w-full rounded-lg"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-between p-4">
                <h2 className="text-2xl font-bold text-white uppercase text-stroke">
                  {meme.top_text}
                </h2>
                <h2 className="text-2xl font-bold text-white uppercase text-stroke">
                  {meme.bottom_text}
                </h2>
              </div>
            </div>

            {/* Akcje */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(meme.id)}
                className={`text-zinc-400 hover:text-red-500 ${
                  meme.likes?.some((like: any) => like.user_id === currentUser?.id)
                    ? "text-red-500"
                    : ""
                }`}
              >
                <Heart className="h-5 w-5 mr-2" />
                {meme.likes?.length || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-zinc-100"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {meme.comments?.length || 0}
              </Button>
            </div>

            {/* Komentarze */}
            <div className="space-y-4">
              <div className="space-y-2">
                {meme.comments?.map((comment: any) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.users?.avatar} />
                      <AvatarFallback>{comment.users?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-100">
                          {comment.users?.name}
                        </p>
                        <span className="text-xs text-zinc-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {currentUser && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Dodaj komentarz..."
                    value={comments[meme.id] || ''}
                    onChange={(e) => setComments(prev => ({
                      ...prev,
                      [meme.id]: e.target.value
                    }))}
                    className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleComment(meme.id)}
                    className="text-zinc-400 hover:text-zinc-100"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 