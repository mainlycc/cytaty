import { ContactForm } from         "@/app/components/contact-form"
import { NavMenu } from "@/app/components/ui/nav-menu"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <NavMenu />
      
      <main className="container mx-auto px-4 py-16 relative">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2">Kontakt</h1>
          <p className="text-zinc-400 text-center mb-8">
            Masz pytanie? Napisz do nas!
          </p>
          <div className="flex flex-col gap-6">
            <ContactForm />
            <div className="text-balance text-center text-xs text-muted-foreground">
              Odpowiemy najszybciej jak to możliwe.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 