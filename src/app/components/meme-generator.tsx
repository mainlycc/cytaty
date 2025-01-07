"use client"

import { useState, useRef } from "react"
import Draggable from "react-draggable"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import Image from 'next/image';
import type { DraggableData, DraggableEvent } from 'react-draggable';

type MemeData = {
  id?: string
  user_id: string
  image_url: string
  top_text: string | null
  bottom_text: string | null
  created_at: string
  hashtags: string[]
  likes: number
  top_position: { x: number; y: number }
  bottom_position: { x: number; y: number }
}

export function MemeGenerator() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [topText, setTopText] = useState("")
  const [bottomText, setBottomText] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState<string>("")
  const [topPosition, setTopPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [bottomPosition, setBottomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [topPercentPosition, setTopPercentPosition] = useState<{ x: number; y: number }>({ x: 50, y: 20 });
  const [bottomPercentPosition, setBottomPercentPosition] = useState<{ x: number; y: number }>({ x: 50, y: 80 });
  const supabase = createClientComponentClient()
  const topTextDraggableRef = useRef<HTMLElement>(null)
  const bottomTextDraggableRef = useRef<HTMLElement>(null)
  const topTextRef = useRef<HTMLDivElement>(null)
  const bottomTextRef = useRef<HTMLDivElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()])
      }
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        throw new Error('Musisz być zalogowany aby zapisać mem')
      }

      if (!selectedImage) {
        throw new Error('Nie wybrano obrazu')
      }

      // Sprawdzanie rozmiaru pliku
      if (selectedImage.size > 5 * 1024 * 1024) {
        throw new Error('Plik jest za duży. Maksymalny rozmiar to 5MB')
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(selectedImage.type)) {
        throw new Error('Niedozwolony format pliku. Dozwolone formaty to: JPG, PNG, GIF')
      }

      // Generowanie unikalnej nazwy pliku
      const timestamp = new Date().getTime()
      const fileExt = selectedImage.name.split('.').pop()
      const fileName = `${session.user.id}-${timestamp}.${fileExt}`

      // Upload pliku do storage
      const { error: uploadError } = await supabase.storage
        .from('memes')
        .upload(fileName, selectedImage)

      if (uploadError) {
        console.error('Błąd podczas uploadu:', uploadError)
        throw new Error(`Błąd podczas uploadu: ${uploadError.message}`)
      }

      // Pobranie publicznego URL
      const { data: urlData } = supabase.storage
        .from('memes')
        .getPublicUrl(fileName)

      if (!urlData?.publicUrl) {
        throw new Error('Nie udało się uzyskać publicznego URL')
      }

      const memeData: MemeData = {
        user_id: session.user.id,
        image_url: urlData.publicUrl,
        top_text: topText || null,
        bottom_text: bottomText || null,
        created_at: new Date().toISOString(),
        hashtags: tags.length > 0 ? tags : ['mem'],
        likes: 0,
        top_position: topPercentPosition,
        bottom_position: bottomPercentPosition
      }

      const { error: insertError } = await supabase
        .from('memes')
        .insert([memeData])

      if (insertError) {
        console.error('Błąd podczas zapisywania do bazy:', insertError)
        throw new Error(`Błąd podczas zapisywania: ${insertError.message}`)
      }

      // Czyszczenie formularza po udanym zapisie
      setSelectedImage(null)
      setTopText('')
      setBottomText('')
      setPreviewUrl('')
      setTags([])
      setTopPosition({ x: 0, y: 0 })
      setBottomPosition({ x: 0, y: 0 })
      
      toast.success('Mem został pomyślnie utworzony!', {
        description: 'Możesz go zobaczyć na stronie głównej.',
        duration: 5000,
      })

    } catch (error) {
      console.error('Szczegóły błędu:', error)
      toast.error(error instanceof Error ? error.message : 'Wystąpił nieznany błąd podczas zapisywania mema')
    }
  }

  const handleDragStop = (position: { x: number; y: number }, isTop: boolean) => {
    const container = document.querySelector('.meme-preview-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const percentX = (position.x / rect.width) * 100;
    const percentY = (position.y / rect.height) * 100;

    if (isTop) {
      setTopPosition({ x: position.x, y: position.y });
      setTopPercentPosition({ x: percentX, y: percentY });
    } else {
      setBottomPosition({ x: position.x, y: position.y });
      setBottomPercentPosition({ x: percentX, y: percentY });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80 h-fit">
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-4">
            <Label htmlFor="image" className="text-zinc-400">
              Wybierz zdjęcie
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="topText" className="text-zinc-400">
              Tekst górny
            </Label>
            <Input
              id="topText"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="Wpisz tekst górny"
              className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="bottomText" className="text-zinc-400">
              Tekst dolny
            </Label>
            <Input
              id="bottomText"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="Wpisz tekst dolny"
              className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="tags" className="text-zinc-400">
              Hashtagi
            </Label>
            <div className="space-y-2">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Wpisz tag i naciśnij Enter"
                className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-red-950/50 text-red-500 border border-red-800 rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={!selectedImage}
            className="w-full bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Zapisz mem
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
        <CardContent className="p-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {previewUrl ? (
              <div className="relative w-full h-full meme-preview-container">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0">
                  {topText && (
                    <Draggable
                      nodeRef={topTextDraggableRef as React.RefObject<HTMLElement>}
                      bounds="parent"
                      position={topPosition}
                      onStop={(e: DraggableEvent, data: DraggableData) => 
                        handleDragStop({ x: data.x, y: data.y }, true)
                      }
                    >
                      <div 
                        ref={(element) => {
                          if (element) {
                            topTextRef.current = element;
                            (topTextDraggableRef as React.MutableRefObject<HTMLElement>).current = element;
                          }
                        }}
                        className="text-2xl font-bold text-white uppercase cursor-move inline-block whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'
                        }}
                      >
                        {topText}
                      </div>
                    </Draggable>
                  )}
                  {bottomText && (
                    <Draggable
                      nodeRef={bottomTextDraggableRef as React.RefObject<HTMLElement>}
                      bounds="parent"
                      position={bottomPosition}
                      onStop={(e: DraggableEvent, data: DraggableData) => 
                        handleDragStop({ x: data.x, y: data.y }, false)
                      }
                    >
                      <div 
                        ref={(element) => {
                          if (element) {
                            bottomTextRef.current = element;
                            (bottomTextDraggableRef as React.MutableRefObject<HTMLElement>).current = element;
                          }
                        }}
                        className="text-2xl font-bold text-white uppercase cursor-move inline-block whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'
                        }}
                      >
                        {bottomText}
                      </div>
                    </Draggable>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-zinc-500">
                Wybierz zdjęcie, aby rozpocząć
              </p>
            )}
          </div>
          <p className="text-zinc-400 text-sm mt-4 text-center">
            Przeciągnij teksty, aby zmienić ich położenie
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 