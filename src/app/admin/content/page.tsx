import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent } from "@/app/components/ui/card"
import Link from "next/link"
import { ImageIcon, BrainCircuit, MessageSquare, AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function ContentModerationPage() {
  const supabase = createServerComponentClient({ cookies })

  // Sprawdzamy sesję i uprawnienia
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth/login")
  }

  // Sprawdzamy rolę użytkownika
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (userData?.role !== 'admin') {
    redirect("/")
  }

  try {
    // Bezpieczne pobieranie statystyk z użyciem count
    const [memesCount, quizzesCount] = await Promise.all([
      supabase
        .from('memes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      
      supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
    ])

    const pendingMemesCount = memesCount.count ?? 0
    const pendingQuizzesCount = quizzesCount.count ?? 0

    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
        
        <main className="container mx-auto px-4 py-16 relative">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-zinc-100 mb-8">Moderacja Treści</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Karta moderacji memów */}
              <Link href="/admin/content/memes" className="block">
                <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80 hover:bg-black/70 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-red-500/10 rounded-lg">
                        <ImageIcon className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100">Moderacja Memów</h3>
                        <div className="mt-1">
                          {pendingMemesCount > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-500">
                              {pendingMemesCount} oczekujących
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-400">Brak oczekujących</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Przeglądaj i zatwierdzaj nowe memy dodane przez użytkowników
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Karta moderacji quizów */}
              <Link href="/admin/content/quizzes" className="block">
                <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80 hover:bg-black/70 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <BrainCircuit className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100">Moderacja Quizów</h3>
                        <div className="mt-1">
                          {pendingQuizzesCount > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                              {pendingQuizzesCount} oczekujących
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-400">Brak oczekujących</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Sprawdzaj i zatwierdzaj quizy stworzone przez społeczność
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Karta moderacji komentarzy */}
              <Link href="/admin/content/comments" className="block">
                <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80 hover:bg-black/70 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-zinc-100">Moderacja Komentarzy</h3>
                        <span className="text-sm text-zinc-400">Zarządzaj komentarzami</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Przeglądaj i moderuj komentarze użytkowników
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Sekcja statystyk */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-zinc-100 mb-6">Statystyki Moderacji</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/10 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-400">Oczekujące treści</p>
                        <p className="text-2xl font-bold text-zinc-100">
                          {pendingMemesCount + pendingQuizzesCount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-500 mb-4">Wystąpił błąd</h1>
          <p className="text-zinc-400">Nie udało się załadować danych moderacji</p>
        </div>
      </div>
    )
  }
}