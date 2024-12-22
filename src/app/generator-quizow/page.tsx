import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NavMenu } from "@/app/components/ui/nav-menu"
import { QuizGenerator } from "@/app/components/quiz-generator"

export default async function QuizGeneratorPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <NavMenu />
      
      <main className="container mx-auto px-4 py-16 relative">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2">Generator Quizów</h1>
          <p className="text-zinc-400 text-center mb-8">
            Stwórz własny quiz filmowy!
          </p>
          <QuizGenerator />
        </div>
      </main>
    </div>
  )
} 