'use client'

import { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { HelpCircle, Book, Target, AlertCircle, Gamepad2, Brain, Trophy, Medal, Star, Rocket, Zap, School } from 'lucide-react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Round } from './round-editor'

type QuizIcon = {
  icon: React.ReactNode;
  name: string;
  value: string;
}

const quizIcons: QuizIcon[] = [
  { icon: <Brain className="w-4 h-4" />, name: "Wiedza", value: "brain" },
  { icon: <Trophy className="w-4 h-4" />, name: "Turniej", value: "trophy" },
  { icon: <Gamepad2 className="w-4 h-4" />, name: "Gra", value: "gamepad" },
  { icon: <Medal className="w-4 h-4" />, name: "Konkurs", value: "medal" },
  { icon: <Star className="w-4 h-4" />, name: "Standardowy", value: "star" },
  { icon: <Rocket className="w-4 h-4" />, name: "Zaawansowany", value: "rocket" },
  { icon: <Zap className="w-4 h-4" />, name: "Szybki", value: "zap" },
  { icon: <School className="w-4 h-4" />, name: "Edukacyjny", value: "school" },
]

export default function TournamentGenerator({ rounds }: { rounds: Round[] }) {
  const [tournamentData, setTournamentData] = useState({
    title: '',
    subtitle: '',
    description: '',
    timePerQuestion: 30,
    difficulty: 'medium',
    rules: '',
    icon: 'star',
    questionsList: []
  })

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("Musisz być zalogowany, aby utworzyć turniej.")
      return
    }

    const { error } = await supabase.from('quizzes').insert({
      user_id: user.id,
      title: tournamentData.title,
      subtitle: tournamentData.subtitle,
      description: tournamentData.description,
      timePerQuestion: tournamentData.timePerQuestion,
      questions: rounds,
      difficulty: tournamentData.difficulty,
      rules: tournamentData.rules,
      icon: tournamentData.icon
    })

    if (error) {
      console.error("Błąd podczas zapisywania turnieju:", error)
      alert("Wystąpił błąd podczas zapisywania turnieju.")
    } else {
      alert("Turniej został zapisany pomyślnie!")
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Generator Turniejów</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tytuł i podtytuł */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Tytuł
                </Label>
                <Input
                  id="title"
                  value={tournamentData.title}
                  onChange={(e) => setTournamentData({...tournamentData, title: e.target.value})}
                  placeholder="Wprowadź tytuł turnieju"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="subtitle">Podtytuł</Label>
                <Input
                  id="subtitle"
                  value={tournamentData.subtitle}
                  onChange={(e) => setTournamentData({...tournamentData, subtitle: e.target.value})}
                  placeholder="Wprowadź podtytuł turnieju (opcjonalnie)"
                />
              </div>
            </div>

            {/* Opis */}
            <div>
              <Label htmlFor="description" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Opis
              </Label>
              <Textarea
                id="description"
                value={tournamentData.description}
                onChange={(e) => setTournamentData({...tournamentData, description: e.target.value})}
                placeholder="Opisz swój turniej"
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Wybór ikony */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                Ikona quizu
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {quizIcons.map((iconObj) => (
                  <Button
                    key={iconObj.value}
                    type="button"
                    variant={tournamentData.icon === iconObj.value ? "default" : "outline"}
                    className="flex flex-col items-center gap-1 p-2 h-auto"
                    onClick={() => setTournamentData({...tournamentData, icon: iconObj.value})}
                  >
                    {iconObj.icon}
                    <span className="text-xs">{iconObj.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Poziom trudności */}
            <div>
              <Label htmlFor="difficulty" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Poziom trudności
              </Label>
              <Select
                value={tournamentData.difficulty}
                onValueChange={(value) => setTournamentData({...tournamentData, difficulty: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz poziom trudności" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Łatwy</SelectItem>
                  <SelectItem value="medium">Średni</SelectItem>
                  <SelectItem value="hard">Trudny</SelectItem>
                  <SelectItem value="expert">Ekspert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zasady */}
            <div>
              <Label htmlFor="rules" className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                Zasady turnieju
              </Label>
              <Textarea
                id="rules"
                value={tournamentData.rules}
                onChange={(e) => setTournamentData({...tournamentData, rules: e.target.value})}
                placeholder="Wprowadź zasady turnieju"
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Przycisk submit */}
            <Button type="submit" className="w-full">
              Utwórz Turniej
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

