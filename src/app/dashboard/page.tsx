import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { LogOut, User } from "lucide-react"
import { NavMenu } from "@/app/components/ui/nav-menu"
import { ClientProfileWrapper } from "@/app/components/profile-components"

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
                    <span className="text-sm font-medium text-zinc-400">Ulubione cytaty</span>
                    <span className="text-2xl font-bold text-zinc-100">0</span>
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-800/80 bg-black/50 backdrop-blur-sm p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-zinc-400">Dodane cytaty</span>
                    <span className="text-2xl font-bold text-zinc-100">0</span>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}