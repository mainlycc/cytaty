import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent } from "@/app/components/ui/card"
import { MemeModeration } from "@/app/components/meme-moderation"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function AdminMemesPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Sprawdzamy sesję i uprawnienia
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth/login")
  }

  try {
    // Pobierz memy oczekujące na moderację
    const { data: pendingMemes } = await supabase
      .from('memes')
      .select(`
        *,
        users (
          name,
          username
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
        
        <main className="container mx-auto px-4 py-16 relative">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-zinc-100 mb-8">Moderacja Memów</h1>
            
            <div className="grid gap-6">
              {pendingMemes?.map((meme, index) => (
                <Card key={meme.id} className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-48 h-48 relative">
                        <Image 
                          src={meme.image_url} 
                          alt="Mem do moderacji"
                          fill
                          sizes="192px"
                          priority={index < 3}
                          className="object-cover rounded-lg"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <p className="text-zinc-400 text-sm">
                            Autor: {meme.users?.name || meme.users?.username || 'Nieznany'}
                          </p>
                          <p className="text-zinc-400 text-sm">
                            Data utworzenia: {new Date(meme.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-zinc-100">{meme.top_text}</p>
                          <p className="text-zinc-100">{meme.bottom_text}</p>
                        </div>
                        <MemeModeration memeId={meme.id} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!pendingMemes || pendingMemes.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-zinc-400">Brak memów oczekujących na moderację</p>
                </div>
              )}
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
          <p className="text-zinc-400">Nie udało się załadować memów do moderacji</p>
        </div>
      </div>
    )
  }
}