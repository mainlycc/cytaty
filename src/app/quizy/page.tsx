import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { QuizList } from "@/app/components/quiz-list"
import { UserRanking } from "@/app/components/user-ranking"
import { Database } from "@/lib/database.types"
import { User } from "@supabase/auth-helpers-nextjs"

interface QuizRaw {
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
  }[] | null
}

export default async function QuizPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // Pobierz quizy wraz z informacjami o autorze
  const { data: quizzesRaw, error: quizzesError } = await supabase
    .from('quizzes')
    .select(`
      id,
      title,
      description,
      questions,
      user_id,
      users (
        name,
        username,
        avatar
      )
    `)
    .order('created_at', { ascending: false })

  if (quizzesError) {
    console.error('Błąd podczas pobierania quizów:', quizzesError)
  }

  // Przekształć dane do odpowiedniego formatu
  const quizzes = (quizzesRaw as QuizRaw[] || []).map(quiz => ({
    ...quiz,
    users: quiz.users?.[0] || { name: null, username: null, avatar: null }
  }))

  // Pobierz ranking użytkowników
  const { data: userRanking, error: rankingError } = await supabase
    .from('users')
    .select(`
      id,
      name,
      username,
      avatar
    `)
    .order('points', { ascending: false })
    .limit(10)

  if (rankingError) {
    console.error('Błąd podczas pobierania rankingu:', rankingError)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <main className="container mx-auto px-4 py-16 relative">
        <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2">Quizy Filmowe</h1>
        <p className="text-zinc-400 text-center mb-8">
          Sprawdź swoją wiedzę filmową i rywalizuj z innymi!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Ranking graczy</h2>
            <UserRanking users={userRanking || []} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Dostępne quizy</h2>
            <QuizList quizzes={quizzes} currentUser={session?.user || null} />
          </div>
        </div>
      </main>
    </div>
  )
} 