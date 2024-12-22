"use client"

import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Play } from "lucide-react"
import Link from "next/link"

interface QuizListProps {
  quizzes: Array<{
    id: string
    title: string
    description?: string
    created_at: string
    users: {
      name?: string
      username?: string
      avatar?: string
    }
  }>
  currentUser: any
}

export function QuizList({ quizzes, currentUser }: QuizListProps) {
  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={quiz.users?.avatar} />
                <AvatarFallback>{quiz.users?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-zinc-100">{quiz.users?.name}</p>
                <p className="text-sm text-zinc-400">
                  {new Date(quiz.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-zinc-100">{quiz.title}</h3>
              {quiz.description && (
                <p className="mt-1 text-sm text-zinc-400">{quiz.description}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Link href={`/quiz/${quiz.id}`}>
                <Button className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50">
                  <Play className="h-4 w-4 mr-2" />
                  Rozpocznij quiz
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 