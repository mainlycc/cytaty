import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NavMenu } from "@/app/components/ui/nav-menu"
import { MemeWall } from "@/app/components/meme-wall"

export default async function MemePage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Pobierz memy wraz z informacjami o polubieniach i komentarzach
  const { data: memes } = await supabase
    .from('memes')
    .select(`
      *,
      users (name, username, avatar),
      likes (id, user_id),
      comments (
        id,
        content,
        created_at,
        users (
          id,
          name,
          username,
          avatar
        )
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <NavMenu />
      
      <main className="container mx-auto px-4 py-16 relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2">Memy</h1>
          <p className="text-zinc-400 text-center mb-8">
            Najlepsze memy filmowe w jednym miejscu!
          </p>
          <MemeWall memes={memes || []} currentUser={session?.user} />
        </div>
      </main>
    </div>
  )
} 