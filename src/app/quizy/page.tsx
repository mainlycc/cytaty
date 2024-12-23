import { Card } from "@/app/components/ui/card"
import Link from "next/link"
import { Trophy, Star, Film, Award } from 'lucide-react'

export default function HomePage() {
  // Przykładowe dane dla rankingu
  const rankings = [
    { id: 1, name: "Anna K.", points: 2500, gamesPlayed: 45 },
    { id: 2, name: "Tomasz W.", points: 2350, gamesPlayed: 42 },
    { id: 3, name: "Marta S.", points: 2200, gamesPlayed: 38 },
    { id: 4, name: "Piotr N.", points: 2100, gamesPlayed: 36 },
    { id: 5, name: "Ewa L.", points: 2000, gamesPlayed: 35 },
  ]

  // Przykładowe dane dla quizów
  const quizzes = [
    {
      id: 1,
      title: "Klasyka Kina",
      description: "Sprawdź swoją wiedzę o klasycznych filmach wszech czasów",
      difficulty: "Średni",
      questions: 20,
      icon: Film,
    },
    {
      id: 2,
      title: "Oscary 2023",
      description: "Quiz o filmach nominowanych do Oscarów w 2023",
      difficulty: "Trudny",
      questions: 15,
      icon: Award,
    },
    {
      id: 3,
      title: "Gwiazdy Kina",
      description: "Rozpoznaj znanych aktorów i ich role",
      difficulty: "Łatwy",
      questions: 25,
      icon: Star,
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Filmowe Quizy</h1>
      <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Ranking graczy */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Ranking graczy
          </h2>
          <div className="space-y-4">
            {rankings.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg w-6">{index + 1}.</span>
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Rozegrane gry: {player.gamesPlayed}
                    </p>
                  </div>
                </div>
                <div className="font-bold text-primary">{player.points} pkt</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Lista quizów */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Dostępne quizy</h2>
          <div className="space-y-4">
            {quizzes.map((quiz) => {
              const Icon = quiz.icon
              return (
                <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                  <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {quiz.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-primary">
                        Poziom: {quiz.difficulty}
                      </span>
                      <span className="text-muted-foreground">
                        Pytań: {quiz.questions}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

