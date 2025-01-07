'use client'

import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog"

export const DeleteMemeButton = ({ memeId }: { memeId: string }) => {
  const supabase = createClientComponentClient()

  const handleDeleteMeme = async () => {
    if (!confirm('Czy na pewno chcesz usunąć ten mem?')) return;
    
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
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-red-500">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-100">
            Czy na pewno chcesz usunąć ten mem?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Ta akcja jest nieodwracalna. Mem zostanie trwale usunięty z systemu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border-zinc-700">
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteMeme}
            className="bg-red-500 hover:bg-red-600 text-white border-0"
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DeleteQuizButton({ quizId }: { quizId: string }) {
  const supabase = createClientComponentClient()

  const handleDeleteQuiz = async () => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId)

      if (error) throw error
      
      window.location.reload()
    } catch (error) {
      console.error('Błąd podczas usuwania quizu:', error)
      alert('Wystąpił błąd podczas usuwania quizu')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-red-500">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-100">
            Czy na pewno chcesz usunąć ten quiz?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Ta akcja jest nieodwracalna. Quiz zostanie trwale usunięty z systemu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border-zinc-700">
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteQuiz}
            className="bg-red-500 hover:bg-red-600 text-white border-0"
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 