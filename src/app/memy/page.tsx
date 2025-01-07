'use client'

import { MemeWall } from "@/app/components/meme-wall"

export default function MemyPage() {
  return (
    <div className="min-h-screen bg-black/70 text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Ściana Memów</h1>
      <MemeWall />
    </div>
  )
}

