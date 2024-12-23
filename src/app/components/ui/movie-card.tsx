'use client'

import type { Movie } from '@/lib/tmdb'

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto"
      />
      <div className="p-4">
        <h3 className="font-semibold">{movie.title}</h3>
        <p className="text-sm text-gray-600">{movie.release_date}</p>
      </div>
    </div>
  )
}

