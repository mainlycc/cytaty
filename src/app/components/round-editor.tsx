'use client'

import { useState } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Plus, Trash2, Save, Edit2 } from 'lucide-react'

export interface Round {
  id: number
  question: string
  answers: string[]
  correctAnswer: number
}

export default function RoundEditor({ onRoundsChangeAction }: { onRoundsChangeAction: (rounds: Round[]) => void }) {
  const [rounds, setRounds] = useState<Round[]>([])
  const [currentRound, setCurrentRound] = useState({
    question: '',
    answers: ['', '', '', ''],
    correctAnswer: 0
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...currentRound.answers]
    newAnswers[index] = value
    setCurrentRound({ ...currentRound, answers: newAnswers })
  }

  const handleSaveRound = () => {
    if (currentRound.question.trim() === '' || 
        currentRound.answers.some(answer => answer.trim() === '')) {
      alert('Proszę wypełnić wszystkie pola')
      return
    }

    if (editingIndex !== null) {
      // Edytowanie istniejącej rundy
      const newRounds = [...rounds]
      newRounds[editingIndex] = {
        ...currentRound,
        id: rounds[editingIndex].id
      }
      setRounds(newRounds)
      setEditingIndex(null)
    } else {
      // Dodawanie nowej rundy
      setRounds([
        ...rounds,
        {
          ...currentRound,
          id: Date.now()
        }
      ])
    }

    // Reset formularza
    setCurrentRound({
      question: '',
      answers: ['', '', '', ''],
      correctAnswer: 0
    })

    // Aktualizuj listę rund
    onRoundsChangeAction(rounds)
  }

  const handleEditRound = (index: number) => {
    setCurrentRound({
      question: rounds[index].question,
      answers: [...rounds[index].answers],
      correctAnswer: rounds[index].correctAnswer
    })
    setEditingIndex(index)
  }

  const handleDeleteRound = (index: number) => {
    const newRounds = rounds.filter((_, i) => i !== index)
    setRounds(newRounds)
    onRoundsChangeAction(newRounds)
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Edytor Rund</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formularz dodawania/edycji rundy */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Pytanie</Label>
              <Textarea
                id="question"
                value={currentRound.question}
                onChange={(e) => setCurrentRound({
                  ...currentRound,
                  question: e.target.value
                })}
                placeholder="Wprowadź treść pytania"
                className="mt-1"
              />
            </div>

            <div className="space-y-4">
              <Label>Odpowiedzi</Label>
              {currentRound.answers.map((answer, index) => (
                <div key={index} className="flex items-center gap-2">
                  <RadioGroup
                    value={currentRound.correctAnswer.toString()}
                    onValueChange={(value) => setCurrentRound({
                      ...currentRound,
                      correctAnswer: parseInt(value)
                    })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                    </div>
                  </RadioGroup>
                  <Input
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={`Odpowiedź ${index + 1}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>

            <Button 
              onClick={handleSaveRound}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingIndex !== null ? 'Zapisz zmiany' : 'Dodaj rundę'}
            </Button>
          </div>

          {/* Lista rund */}
          <div className="space-y-4">
            <h3 className="font-semibold">Lista rund ({rounds.length})</h3>
            {rounds.map((round, index) => (
              <Card key={round.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{index + 1}. {round.question}</p>
                      <ul className="mt-2 space-y-1">
                        {round.answers.map((answer, ansIndex) => (
                          <li 
                            key={ansIndex}
                            className={ansIndex === round.correctAnswer ? 'text-green-600 font-medium' : ''}
                          >
                            {String.fromCharCode(65 + ansIndex)}) {answer}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditRound(index)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteRound(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

