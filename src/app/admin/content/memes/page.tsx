import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent } from "@/app/components/ui/card"
import { MemeModeration } from "@/app/components/meme-moderation"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/app/components/ui/badge"

export default async function AdminMemesPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Sprawdzamy sesję i uprawnienia
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth/login")
  }

  // Sprawdzenie roli administratora
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (userData?.role !== 'admin') {
    redirect("/dashboard")
  }

  try {
    // Pobierz memy oczekujące na moderację
    const { data: pendingMemes } = await supabase
      .from('memes')
      .select(`
        *,
        users (
          id,
          name,
          username,
          avatar,
          role
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
                    <div className="grid md:grid-cols-[250px_1fr] gap-6">
                      {/* Wizualizacja mema z tekstami */}
                      <div className="relative w-full h-[250px]">
                        <Image 
                          src={meme.image_url} 
                          alt="Mem do moderacji"
                          fill
                          sizes="(max-width: 768px) 100vw, 250px"
                          priority={index < 3}
                          className="object-cover rounded-lg"
                          style={{ objectFit: "cover" }}
                        />
                        
                        {/* Tekst górny z pozycjonowaniem */}
                        {meme.top_text && meme.top_position && (
                          <div 
                            className="absolute text-center font-bold drop-shadow-[0_0_2px_rgba(0,0,0,1)] uppercase break-words px-2"
                            style={{
                              top: `${meme.top_position.y}px`,
                              left: `${meme.top_position.x}px`,
                              transform: 'translate(-50%, -50%)',
                              color: meme.top_text_color || '#ffffff',
                              fontSize: `${(meme.top_text_size || 3) * 0.5 + 0.5}rem`,
                              maxWidth: '95%'
                            }}
                          >
                            {meme.top_text}
                          </div>
                        )}
                        
                        {/* Tekst dolny z pozycjonowaniem */}
                        {meme.bottom_text && meme.bottom_position && (
                          <div 
                            className="absolute text-center font-bold drop-shadow-[0_0_2px_rgba(0,0,0,1)] uppercase break-words px-2"
                            style={{
                              top: `${meme.bottom_position.y}px`,
                              left: `${meme.bottom_position.x}px`,
                              transform: 'translate(-50%, -50%)',
                              color: meme.bottom_text_color || '#ffffff',
                              fontSize: `${(meme.bottom_text_size || 3) * 0.5 + 0.5}rem`,
                              maxWidth: '95%'
                            }}
                          >
                            {meme.bottom_text}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        {/* Informacje o autorze */}
                        <div className="flex items-center gap-3 mb-4">
                          {meme.users?.avatar && (
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <Image 
                                src={meme.users.avatar} 
                                alt={meme.users?.name || "Autor mema"}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-zinc-100 font-medium">
                              {meme.users?.name || meme.users?.username || 'Nieznany użytkownik'}
                              {meme.users?.role === 'admin' && (
                                <Badge className="ml-2 bg-red-900 text-red-100">Admin</Badge>
                              )}
                            </p>
                            <p className="text-zinc-400 text-sm">
                              Dodano: {new Date(meme.created_at).toLocaleDateString()} o {new Date(meme.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Wartości tekstu */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-900/30 rounded-lg">
                          <div>
                            <p className="text-zinc-400 text-xs mb-1">Tekst górny:</p>
                            <p className="text-zinc-100">{meme.top_text || "—"}</p>
                            {meme.top_text && (
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs text-zinc-500">
                                  Rozmiar: {meme.top_text_size || 3}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  Kolor: <span className="inline-block w-3 h-3 rounded-full align-middle" style={{backgroundColor: meme.top_text_color || '#ffffff'}}></span>
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-zinc-400 text-xs mb-1">Tekst dolny:</p>
                            <p className="text-zinc-100">{meme.bottom_text || "—"}</p>
                            {meme.bottom_text && (
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs text-zinc-500">
                                  Rozmiar: {meme.bottom_text_size || 3}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  Kolor: <span className="inline-block w-3 h-3 rounded-full align-middle" style={{backgroundColor: meme.bottom_text_color || '#ffffff'}}></span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Tagi */}
                        {Array.isArray(meme.hashtags) && meme.hashtags.length > 0 && (
                          <div>
                            <p className="text-zinc-400 text-xs mb-1">Tagi:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {meme.hashtags.map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="bg-red-950/50 text-red-300 border-red-800/30">
                                  #{typeof tag === 'string' ? tag.replace(/\\\"/g, '').replace(/\"/g, '') : tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Przyciski moderacji */}
                        <div className="mt-6">
                          <MemeModeration memeId={meme.id} />
                        </div>
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