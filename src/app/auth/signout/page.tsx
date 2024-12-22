import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Home } from "lucide-react"

export default function SignOutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <div className="text-center space-y-6 p-8 bg-black/50 backdrop-blur-sm rounded-xl border border-zinc-800/80">
        <h1 className="text-2xl font-semibold text-zinc-100">
          Wylogowano Cię z profilu
        </h1>
        <p className="text-zinc-400">Do zobaczenia ponownie!</p>
        <Link href="/">
          <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">
            <Home className="h-4 w-4 mr-2" />
            Wróć do strony głównej
          </Button>
        </Link>
      </div>
    </div>
  )
} 