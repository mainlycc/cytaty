"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

export function MemeGenerator() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [topText, setTopText] = useState("")
  const [bottomText, setBottomText] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const supabase = createClientComponentClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nie znaleziono użytkownika')

      // Najpierw zapisz obraz
      const file = selectedImage
      if (!file) throw new Error('Nie wybrano obrazu')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `memes/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('memes')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('memes')
        .getPublicUrl(filePath)

      // Zapisz mem w bazie danych
      const { error } = await supabase.from('memes').insert({
        user_id: user.id,
        image_url: publicUrl,
        top_text: topText,
        bottom_text: bottomText
      })

      if (error) throw error

      toast.success('Mem został zapisany!')
      // Reset formularza
      setSelectedImage(null)
      setTopText('')
      setBottomText('')
      setPreviewUrl('')
    } catch (error) {
      console.error('Błąd:', error)
      toast.error('Wystąpił błąd podczas zapisywania mema')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Panel podglądu */}
      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
        <CardContent className="p-6">
          <div className="aspect-video bg-zinc-900/50 rounded-lg overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                {/* Tekst mema */}
                <div className="absolute inset-0 flex flex-col items-center justify-between p-4">
                  <h2 className="text-2xl font-bold text-white uppercase text-stroke">
                    {topText}
                  </h2>
                  <h2 className="text-2xl font-bold text-white uppercase text-stroke">
                    {bottomText}
                  </h2>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500">Wybierz zdjęcie, aby rozpocząć</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Panel kontrolny */}
      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
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

          <Button 
            onClick={handleSave}
            className="w-full bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
          >
            Zapisz mem
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 