'use client'

import { useState } from 'react'
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function DeleteMemeButton({ memeId }: { memeId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClientComponentClient()

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć ten mem?')) return;
    
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('memes')
        .delete()
        .eq('id', memeId)

      if (error) throw error
      
      // Odśwież stronę po usunięciu
      window.location.reload()
    } catch (error) {
      console.error('Błąd podczas usuwania mema:', error)
      alert('Wystąpił błąd podczas usuwania mema')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-400 hover:text-red-300"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}

export function DeleteQuizButton({ quizId }: { quizId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClientComponentClient()

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć ten quiz?')) return;
    
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId)

      if (error) throw error
      
      // Odśwież stronę po usunięciu
      window.location.reload()
    } catch (error) {
      console.error('Błąd podczas usuwania quizu:', error)
      alert('Wystąpił błąd podczas usuwania quizu')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-400 hover:text-red-300"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
} 