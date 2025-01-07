import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/app/components/ui/card"
import { 
  Users, 
  ImageIcon, 
  BrainCircuit, 
  Flag,
  MessageSquare 
} from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth/login")
  }

  // Sprawdzamy czy użytkownik jest adminem
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (userData?.role !== 'admin') {
    redirect("/")
  }

  // Pobieramy statystyki
  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: memesCount } = await supabase
    .from('memes')
    .select('*', { count: 'exact', head: true })

  const { count: quizzesCount } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true })

  const { count: commentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <main className="container mx-auto px-4 py-16 relative">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-100 mb-8">Panel Administratora</h1>
          
          {/* Statystyki */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">Użytkownicy</p>
                    <p className="text-2xl font-bold text-zinc-100">{usersCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">Memy</p>
                    <p className="text-2xl font-bold text-zinc-100">{memesCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <BrainCircuit className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">Quizy</p>
                    <p className="text-2xl font-bold text-zinc-100">{quizzesCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">Komentarze</p>
                    <p className="text-2xl font-bold text-zinc-100">{commentsCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sekcje zarządzania */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Zarządzanie Użytkownikami</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Przeglądaj, edytuj i zarządzaj kontami użytkowników.
                </p>
                <div className="flex justify-end">
                  <a href="/admin/users" className="text-blue-500 hover:text-blue-400 text-sm">
                    Przejdź do zarządzania →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Moderacja Treści</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Moderuj memy, quizy i komentarze użytkowników.
                </p>
                <div className="flex justify-end">
                  <a href="/admin/content" className="text-blue-500 hover:text-blue-400 text-sm">
                    Przejdź do moderacji →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Zgłoszenia</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Przeglądaj i rozpatruj zgłoszenia od użytkowników.
                </p>
                <div className="flex justify-end">
                  <a href="/admin/reports" className="text-blue-500 hover:text-blue-400 text-sm">
                    Przejdź do zgłoszeń →
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}