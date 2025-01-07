'use client'

import { MemeWall } from "@/app/components/meme-wall"

export default function MemyPage() {
  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-red-800/70" />
      
      
      {/* Content */}
      <div className="relative p-4">
        <h1 className="text-2xl font-bold mb-8 text-center text-white">Ściana Memów</h1>
        <MemeWall />
      </div>
    </div>
  )
}

