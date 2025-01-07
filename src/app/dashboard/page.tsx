import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Edit, ShieldAlert } from "lucide-react"
import { ClientProfileWrapper } from "@/app/components/profile-components"
import Link from "next/link"
import { DeleteMemeButton, DeleteQuizButton } from "@/app/components/delete-buttons"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: sessionData } = await supabase.auth.getSession()
  const session = sessionData?.session;

  if (!session) {
    redirect("/auth/login")
  }

  let { data: userData, error } = await supabase
    .from('users')
    .select('*, role')
    .eq('id', session.user.id)
    .single()

  if (!userData && !error) {
    const defaultUserData = {
      id: session.user.id,
      email: session.user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: newUserData } = await supabase
      .from('users')
      .insert([defaultUserData])
      .select()
      .single()

    userData = newUserData
  }

  const defaultValues = {
    name: userData?.name || "",
    username: userData?.username || "",
    avatar: userData?.avatar || "",
    bio: userData?.bio || "",
    website: userData?.website || "",
    twitter: userData?.twitter || "",
    instagram: userData?.instagram || "",
  }

  // Pobierz memy i quizy użytkownika
  const { data: userMemes } = await supabase
    .from('memes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  const { data: userQuizzes } = await supabase
    .from('quizzes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <main className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            {userData?.role === 'admin' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-zinc-100">Panel Administratora</h2>
                <Link href="/admin/dashboard">
                  <div className="rounded-lg border border-red-800/80 bg-red-950/20 backdrop-blur-sm p-6 hover:bg-red-900/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <ShieldAlert className="w-6 h-6 text-red-500" />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-red-500">Panel Administratora</h3>
                        <p className="text-sm text-red-400/80">
                          Zarządzaj użytkownikami, treściami i ustawieniami strony
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-zinc-100">Twoje Narzędzia</h2>
              <div className="grid gap-6">
                <Link href="/generator-memow">
                  <div className="rounded-lg border border-zinc-800/80 bg-black/50 backdrop-blur-sm p-6 hover:bg-black/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-zinc-100">Generator Memów</h3>
                        <p className="text-sm text-zinc-400">
                          Stwórz własne memy z ulubionych scen filmowych
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/generator-quizow">
                  <div className="rounded-lg border border-zinc-800/80 bg-black/50 backdrop-blur-sm p-6 hover:bg-black/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-zinc-100">Generator Quizów</h3>
                        <p className="text-sm text-zinc-400">
                          Twórz własne quizy filmowe i sprawdź wiedzę innych
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-zinc-100">Twoje Statystyki</h2>
              <div className="grid gap-6">
                <div className="grid gap-6 grid-cols-2">
                  <div className="rounded-lg border border-zinc-800/80 bg-black/50 backdrop-blur-sm p-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-zinc-400">Twoje memy</span>
                      <span className="text-2xl font-bold text-zinc-100">{userMemes?.length || 0}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-800/80 bg-black/50 backdrop-blur-sm p-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-zinc-400">Twoje quizy</span>
                      <span className="text-2xl font-bold text-zinc-100">{userQuizzes?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-100">Ostatnio utworzone</h2>
              <div className="grid gap-4">
                {userMemes?.slice(0, 3).map(meme => (
                  <div key={meme.id} className="p-4 border border-zinc-800/80 bg-black/50 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={meme.image_url} alt="Mem" className="w-16 h-16 object-cover rounded" />
                        <div>
                          <p className="text-zinc-100">{meme.top_text}</p>
                          <p className="text-zinc-400 text-sm">
                            {new Date(meme.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/generator-memow/edit/${meme.id}`}>
                          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteMemeButton memeId={meme.id} />
                      </div>
                    </div>
                  </div>
                ))}
                
                {userQuizzes?.slice(0, 3).map(quiz => (
                  <div key={quiz.id} className="p-4 border border-zinc-800/80 bg-black/50 backdrop-blur-sm rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-zinc-100">{quiz.title}</h4>
                        <p className="text-zinc-400 text-sm">
                          {quiz.description?.slice(0, 100)}...
                        </p>
                        <p className="text-zinc-400 text-sm mt-2">
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/generator-quizow/edit/${quiz.id}`}>
                          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteQuizButton quizId={quiz.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-6 text-zinc-100">Zarządzanie Profilem</h2>
            <ClientProfileWrapper 
              userData={userData}
              defaultValues={defaultValues}
            />
          </div>
        </div>
      </main>
    </div>
  )
}