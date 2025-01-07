'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent } from "@/app/components/ui/card"
import { approveMeme, rejectMeme } from "./actions"

interface User {
  id: string
  username: string
  email: string
  created_at: string
}

interface Meme {
  id: number
  created_at: string
  image_url: string
  top_text: string
  bottom_text: string
  status: 'pending' | 'approved' | 'rejected'
  users: {
    username: string
    email: string
  }
}

interface Quiz {
  id: number
  title: string
  description: string
  created_at: string
  status: 'pending' | 'approved' | 'rejected'
  users: {
    username: string
    email: string
  }
}

export default function AdminDashboard() {
  const [memes, setMemes] = useState<Meme[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [users, setUsers] = useState<User[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      // Pobierz memy
      const { data: memesData, error: memesError } = await supabase
        .from('memes')
        .select(`
          *,
          users (
            username,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (memesError) {
        console.error('Błąd podczas pobierania memów:', memesError)
        return
      }

      // Pobierz quizy
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select(`
          *,
          users (
            username,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (quizzesError) {
        console.error('Błąd podczas pobierania quizów:', quizzesError)
        return
      }

      // Pobierz użytkowników
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) {
        console.error('Błąd podczas pobierania użytkowników:', usersError)
        return
      }

      if (memesData) setMemes(memesData)
      if (quizzesData) setQuizzes(quizzesData)
      if (usersData) setUsers(usersData)
    } catch (error) {
      console.error('Nieoczekiwany błąd:', error)
    }
  }

  const handleMemeApproval = async (memeId: number) => {
    const { success } = await approveMeme(memeId)
    if (success) {
      fetchData() // Odśwież dane po zatwierdzeniu
    }
  }

  const handleMemeRejection = async (memeId: number) => {
    const { success } = await rejectMeme(memeId)
    if (success) {
      fetchData() // Odśwież dane po odrzuceniu
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Panel Administratora</h1>
      
      <Tabs defaultValue="memes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="memes">Memy</TabsTrigger>
          <TabsTrigger value="quizzes">Quizy</TabsTrigger>
          <TabsTrigger value="users">Użytkownicy</TabsTrigger>
        </TabsList>

        <TabsContent value="memes">
          <div className="grid gap-4">
            {memes.map((meme) => (
              <Card key={meme.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{meme.users.username}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(meme.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {meme.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {meme.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleMemeApproval(meme.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Zatwierdź
                          </button>
                          <button
                            onClick={() => handleMemeRejection(meme.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Odrzuć
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Podobne TabsContent dla quizów i użytkowników */}
      </Tabs>
    </div>
  )
} 