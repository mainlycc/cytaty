'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { fetchUpcomingMovies } from "@/lib/tmdb"

interface Movie {
  id: number
  title: string
  poster_url: string
  premiere_date: string
}

const UpcomingMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUpcomingMovies = async () => {
      try {
        const data = await fetchUpcomingMovies()
        setMovies(data)
      } catch (error) {
        console.error('Błąd podczas pobierania premier:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUpcomingMovies()
  }, [])

  if (isLoading) return null
  if (movies.length === 0) return null

  return (
    <div className="relative h-[400px] w-full">
      <div className="flex gap-3 h-full">
        {movies.map((movie) => (
          <Link 
            href={`/filmy/${movie.id}`} 
            key={movie.id}
            className="relative flex-1 rounded-lg overflow-hidden group cursor-pointer"
          >
            <Image
              src={movie.poster_url}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="font-semibold text-lg truncate">{movie.title}</p>
              <p className="text-zinc-300 text-sm">
                Premiera: {new Date(movie.premiere_date).toLocaleDateString('pl-PL')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UpcomingMovies 