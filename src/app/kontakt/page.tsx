import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ContactForm } from "@/app/components/contact-form"

export default async function ContactPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // Jeśli użytkownik jest zalogowany, pobierz jego dane
  let userData = null
  if (session) {
    const { data: user } = await supabase
      .from('users')
      .select('name')
      .eq('id', session.user.id)
      .single()

    userData = {
      email: session.user.email!,
      name: user?.name
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <main className="container mx-auto px-4 py-16 relative">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2">Kontakt</h1>
          <p className="text-zinc-400 text-center mb-8">
            Masz pytanie? Napisz do nas!
          </p>
          <div className="flex flex-col gap-6">
            <ContactForm currentUser={userData} />
            <div className="text-balance text-center text-xs text-muted-foreground">
              Odpowiemy najszybciej jak to możliwe.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 