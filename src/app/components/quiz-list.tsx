"use client"

import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { User } from "@supabase/auth-helpers-nextjs"

interface Quiz {
  id: number
  title: string
  description: string
  questions: {
    question: string
    answers: string[]
    correctAnswer: number
  }[]
  user_id: string
  users: {
    name: string | null
    username: string | null
    avatar: string | null
  }
}

export function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">{quiz.title}</h3>
            <p className="text-zinc-400 text-sm mb-4">{quiz.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={quiz.users?.avatar || ''} />
                  <AvatarFallback>{quiz.users?.name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <span className="text-zinc-400 text-sm">{quiz.users?.name || 'Anonim'}</span>
              </div>
              <Button 
                className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
                onClick={() => {/* TODO: Dodaj logikę rozpoczęcia quizu */}}
              >
                Rozpocznij Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 