import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NavMenu } from "@/app/components/ui/nav-menu"
import { QuizList } from "@/app/components/quiz-list"
import { UserRanking } from "@/app/components/user-ranking"

export default async function QuizPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // Pobierz quizy wraz z informacjami o autorze
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select(`
      *,
      users (
        name,
        username,
        avatar
      )
    `)
    .order('created_at', { ascending: false })

  // Pobierz ranking użytkowników (możesz dostosować logikę rankingu)
  const { data: userRanking } = await supabase
    .from('users')
    .select(`
      id,
      name,
      username,
      avatar
    `)
    .order('points', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <NavMenu />
      
      <main className="container mx-auto px-4 py-16 relative">
        <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2">Quizy Filmowe</h1>
        <p className="text-zinc-400 text-center mb-8">
          Sprawdź swoją wiedzę filmową i rywalizuj z innymi!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ranking użytkowników */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Ranking graczy</h2>
            <UserRanking users={userRanking || []} />
          </div>

          {/* Lista quizów */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Dostępne quizy</h2>
            <QuizList quizzes={quizzes || []} currentUser={session?.user} />
          </div>
        </div>
      </main>
    </div>
  )
} 