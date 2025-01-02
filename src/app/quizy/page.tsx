'use client'

import { Card } from "@/app/components/ui/card"
import Link from "next/link"
import { Trophy, Film } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  questions: any[];
  icon?: string;
  rules: string;
  user_id: string;
}

interface UserRanking {
  user_id: string;
  name: string;
  total_points: number;
  games_played: number;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface UserMap {
  [key: string]: User;
}

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [rankings, setRankings] = useState<UserRanking[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data, error } = await supabase.from('quizzes').select('*')
      if (error) {
        console.error("Błąd podczas pobierania quizów:", error)
      } else {
        setQuizzes(data || [])
      }
    }

    const fetchRankings = async () => {
      try {
        // Najpierw pobierz wyniki
        const { data: results, error: resultsError } = await supabase
          .from('quiz_results')
          .select('*')

        if (resultsError) throw resultsError

        if (!results || results.length === 0) {
          setRankings([])
          return
        }

        // Następnie pobierz dane użytkowników
        const userIds = [...new Set(results.map(r => r.user_id))]
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, name, email')
          .in('id', userIds)

        if (usersError) throw usersError

        // Utwórz mapę użytkowników dla szybszego dostępu
        const userMap = (users || []).reduce<UserMap>((acc, user) => {
          acc[user.id] = user
          return acc
        }, {})

        // Agreguj wyniki
        const userScores: { [key: string]: UserRanking } = {}

        results.forEach((result) => {
          const userId = result.user_id
          const userData = userMap[userId]

          if (!userScores[userId]) {
            userScores[userId] = {
              user_id: userId,
              name: userData?.name || userData?.email || 'Anonim',
              total_points: 0,
              games_played: 0
            }
          }

          userScores[userId].total_points += result.score
          userScores[userId].games_played += 1
        })

        const rankingsList = Object.values(userScores)
          .sort((a, b) => b.total_points - a.total_points)
          .slice(0, 10)

        setRankings(rankingsList)

      } catch (error) {
        console.error("Szczegóły błędu:", error)
        setRankings([])
      }
    }

    fetchQuizzes()
    fetchRankings()
  }, [])

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
            {rankings.length > 0 ? (
              rankings.map((player, index) => (
                <div
                  key={player.user_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-lg w-6 ${index < 3 ? 'text-yellow-500' : ''}`}>
                      {index + 1}.
                    </span>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Rozegrane gry: {player.games_played}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-primary">{player.total_points} pkt</div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Brak wyników do wyświetlenia
              </div>
            )}
          </div>
        </Card>

        {/* Lista quizów */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Dostępne quizy</h2>
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Link key={quiz.id} href={`/quizy/${quiz.id}`}>
                <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Film className="h-6 w-6 text-primary" />
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
                      Pytań: {quiz.questions.length}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

