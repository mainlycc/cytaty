import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { MemeGenerator } from "@/app/components/meme-generator"

export default async function MemeGeneratorPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <main className="container mx-auto px-4 py-16 relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2">Generator Memów</h1>
          <p className="text-zinc-400 text-center mb-8">
            Stwórz własny mem z ulubionych scen filmowych!
          </p>
          <MemeGenerator />
        </div>
      </main>
    </div>
  )
} 