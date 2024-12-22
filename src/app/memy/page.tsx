import { MemeWall } from "@/app/components/meme-wall"
import { Separator } from "@/app/components/ui/separator"

export default function MemyPage() {
  return (
    <div className="container py-6">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-1 mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Memy</h1>
          <p className="text-zinc-400">
            Przeglądaj i twórz własne memy
          </p>
        </div>

        <Separator className="mb-6" />
        
        <div className="space-y-8">
          <MemeWall />
        </div>
      </div>
    </div>
  )
} 