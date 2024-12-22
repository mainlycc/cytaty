"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "./ui/card"

type Meme = {
  id: number
  created_at: string
  user_id: string
  image_url: string
  top_text: string
  bottom_text: string
}

export function MemeWall() {
  const [memes, setMemes] = useState<Meme[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchMemes = async () => {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Błąd podczas pobierania memów:', error)
        return
      }

      setMemes(data || [])
    }

    fetchMemes()

    // Subskrybuj zmiany w tabeli memes
    const channel = supabase
      .channel('memes_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'memes' 
        }, 
        (payload) => {
          fetchMemes() // Odśwież memy po każdej zmianie
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memes.map((meme) => (
        <Card key={meme.id} className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
          <CardContent className="p-4">
            <div className="relative aspect-video">
              <img
                src={meme.image_url}
                alt="Mem"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-between p-4">
                <h2 className="text-xl font-bold text-white uppercase text-stroke text-center">
                  {meme.top_text}
                </h2>
                <h2 className="text-xl font-bold text-white uppercase text-stroke text-center">
                  {meme.bottom_text}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 