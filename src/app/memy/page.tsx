'use client'

import { MemeWall } from "@/app/components/meme-wall"

export default function MemyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Ściana Memów</h1>
      <MemeWall />
    </div>
  )
}

