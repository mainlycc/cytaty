"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/app/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface MemeModerationProps {
  memeId: string
}

export function MemeModeration({ memeId }: MemeModerationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleModeration = async (newStatus: string) => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      // Aktualizuj tylko kolumnę status
      const { error } = await supabase
        .from('memes')
        .update({ status: newStatus })
        .eq('id', memeId)

      if (error) {
        console.error('Błąd Supabase:', error)
        throw error
      }

      toast.success(
        newStatus === 'approved' 
          ? 'Mem został zaakceptowany' 
          : 'Mem został odrzucony'
      )

      router.refresh()
    } catch (error) {
      console.error('Błąd:', error)
      toast.error('Wystąpił błąd podczas moderacji')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-4 mt-6">
      <Button
        type="button"
        onClick={() => handleModeration('approved')}
        disabled={isLoading}
        className="bg-green-600/20 text-green-500 border border-green-800/80 hover:bg-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Przetwarzanie...' : 'Zaakceptuj'}
      </Button>
      <Button
        type="button"
        onClick={() => handleModeration('rejected')}
        disabled={isLoading}
        className="bg-red-600/20 text-red-500 border border-red-800/80 hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Przetwarzanie...' : 'Odrzuć'}
      </Button>
    </div>
  )
}