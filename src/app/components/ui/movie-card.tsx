'use client'

import type { Movie } from '@/lib/tmdb'

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto"
      />
      <div className="p-4 bg-black/50 backdrop-blur-sm">
        <h3 className="font-semibold text-white">{movie.title}</h3>
        
      </div>
    </div>
  )
}

