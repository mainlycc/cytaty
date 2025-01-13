import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) throw error

      if (user?.user_metadata?.username) {
        const { error: userError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            username: user.user_metadata.username,
            email: user.email,
            updated_at: new Date().toISOString(),
          })
        
        if (userError) {
          console.error('Błąd podczas aktualizacji nazwy użytkownika:', userError)
        }
      }

      // Przekieruj do strony sukcesu z parametrem email
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/verification-success?email=${encodeURIComponent(user?.email || '')}`
      )
    } catch (error) {
      console.error('Błąd podczas weryfikacji:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/verification-error`
      )
    }
  }

  // Przekieruj do strony głównej jeśli nie ma kodu
  return NextResponse.redirect(requestUrl.origin)
}
