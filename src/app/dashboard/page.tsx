import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { LogOut, User } from "lucide-react"
import { NavMenu } from "@/app/components/ui/nav-menu"
import { ClientProfileWrapper } from "@/app/components/profile-components"
import Link from "next/link"

async function handleSignOut() {
  "use server"
  const supabase = createServerComponentClient({ cookies })
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth/login")
  }

  let { data: userData, error } = await supabase
    .from('users')
    .select('*')
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
      
      <NavMenu />
      
      <header className="border-b border-zinc-800/80 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <User className="h-4 w-4" />
                <span className="text-sm">{session.user.email}</span>
              </div>
              <form action={handleSignOut}>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
                  <LogOut className="h-4 w-4 mr-2" />
                  Wyloguj
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-6 text-zinc-100">Zarządzanie Profilem</h2>
            <ClientProfileWrapper 
              userData={userData}
              defaultValues={defaultValues}
            />
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

              <div className="rounded-lg border border-zinc-800/80 bg-black/50 backdrop-blur-sm">
                <div className="p-6">
                  <h3 className="text-md font-semibold mb-4 text-zinc-100">Ostatnia aktywność</h3>
                  <div className="text-sm text-zinc-400">
                    Brak aktywności do wyświetlenia.
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-semibold text-zinc-100">Ostatnio utworzone</h3>
                <div className="grid gap-4">
                  {userMemes?.slice(0, 3).map(meme => (
                    <div key={meme.id} className="p-4 border border-zinc-800/80 bg-black/50 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center gap-4">
                        <img src={meme.image_url} alt="Mem" className="w-16 h-16 object-cover rounded" />
                        <div>
                          <p className="text-zinc-100">{meme.top_text}</p>
                          <p className="text-zinc-400 text-sm">
                            {new Date(meme.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {userQuizzes?.slice(0, 3).map(quiz => (
                    <div key={quiz.id} className="p-4 border border-zinc-800/80 bg-black/50 backdrop-blur-sm rounded-lg">
                      <div>
                        <h4 className="text-zinc-100">{quiz.title}</h4>
                        <p className="text-zinc-400 text-sm">
                          {quiz.description?.slice(0, 100)}...
                        </p>
                        <p className="text-zinc-400 text-sm mt-2">
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
          </div>
        </div>
      </main>
    </div>
  )
}