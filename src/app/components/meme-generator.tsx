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
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const supabase = createClientComponentClient()

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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nie znaleziono użytkownika')

      const file = selectedImage
      if (!file) throw new Error('Nie wybrano obrazu')

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Plik jest za duży. Maksymalny rozmiar to 5MB')
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Niedozwolony format pliku. Dozwolone formaty to: JPG, PNG, GIF')
      }

      const timestamp = new Date().getTime()
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${timestamp}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('memes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Błąd upload:', uploadError)
        throw uploadError
      }

      const { data: urlData } = supabase.storage
        .from('memes')
        .getPublicUrl(filePath)

      if (!urlData.publicUrl) {
        throw new Error('Nie udało się uzyskać publicznego URL')
      }

      const { error: dbError } = await supabase.from('memes').insert({
        user_id: user.id,
        image_url: urlData.publicUrl,
        top_text: topText,
        bottom_text: bottomText
      })

      if (dbError) {
        console.error('Błąd bazy danych:', dbError)
        throw dbError
      }

      toast.success('Mem został zapisany!')
      setSelectedImage(null)
      setTopText('')
      setBottomText('')
      setPreviewUrl('')
      setTags([])
      
    } catch (error: any) {
      console.error('Błąd:', error)
      toast.error(error.message || 'Wystąpił błąd podczas zapisywania mema')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            className="w-full bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
          >
            Zapisz mem
          </Button>
        </CardContent>
      </Card>

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
    </div>
  )
} 