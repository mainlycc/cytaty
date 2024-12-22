"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

interface Question {
  question: string
  answers: string[]
  correctAnswer: number
}

export function QuizGenerator() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", answers: ["", "", "", ""], correctAnswer: 0 }
  ])

  const supabase = createClientComponentClient()

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answers: ["", "", "", ""], correctAnswer: 0 }])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof Question, value: string | number) => {
    const newQuestions = [...questions]
    if (field === "answers") return // handled separately
    
    if (field === "correctAnswer" && typeof value === "number") {
      newQuestions[index].correctAnswer = value
    } else if (field === "question" && typeof value === "string") {
      newQuestions[index].question = value
    }
    
    setQuestions(newQuestions)
  }

  const updateAnswer = (questionIndex: number, answerIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers[answerIndex] = value
    setQuestions(newQuestions)
  }

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nie znaleziono użytkownika')

      const { error } = await supabase.from('quizzes').insert({
        user_id: user.id,
        title,
        description,
        questions: questions
      })

      if (error) throw error

      toast.success('Quiz został zapisany!')
      // Reset formularza
      setTitle('')
      setDescription('')
      setQuestions([{ question: "", answers: ["", "", "", ""], correctAnswer: 0 }])
    } catch (error) {
      console.error('Błąd:', error)
      toast.error('Wystąpił błąd podczas zapisywania quizu')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-4">
            <Label htmlFor="title" className="text-zinc-400">
              Tytuł quizu
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Wprowadź tytuł quizu"
              className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="description" className="text-zinc-400">
              Opis
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Wprowadź opis quizu"
              className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
            />
          </div>
        </CardContent>
      </Card>

      {questions.map((question, questionIndex) => (
        <Card key={questionIndex} className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <Label className="text-zinc-400">
                Pytanie {questionIndex + 1}
              </Label>
              {questions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Input
              value={question.question}
              onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
              placeholder="Wprowadź pytanie"
              className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
            />

            <div className="space-y-4">
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex gap-4 items-center">
                  <Input
                    value={answer}
                    onChange={(e) => updateAnswer(questionIndex, answerIndex, e.target.value)}
                    placeholder={`Odpowiedź ${answerIndex + 1}`}
                    className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className={`min-w-[100px] ${
                      question.correctAnswer === answerIndex
                        ? "bg-green-950/50 text-green-500 border-green-800"
                        : "text-zinc-400"
                    }`}
                    onClick={() => updateQuestion(questionIndex, "correctAnswer", answerIndex)}
                  >
                    {question.correctAnswer === answerIndex ? "Poprawna" : "Zaznacz"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button
          onClick={addQuestion}
          className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj pytanie
        </Button>

        <Button 
          onClick={handleSave}
          className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
        >
          Zapisz quiz
        </Button>
      </div>
    </div>
  )
} 