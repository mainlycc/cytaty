'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react'
import { TimeWindowSwitch } from './time-window-switch'
import { tmdb } from '@/lib/tmdb'
import type { Movie, TimeWindow } from '@/lib/tmdb'
import { Card, CardContent } from './card'
import Image from 'next/image'

export function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('week')

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true)
      setError(null)
      
      try {
        let url: string
        
        // Różne endpointy dla różnych przedziałów czasowych
        if (timeWindow === 'day' || timeWindow === 'week') {
          url = `${tmdb.baseUrl}/trending/movie/${timeWindow}?api_key=${tmdb.apiKey}&language=pl-PL`
        } else {
          // Dla miesiąca i roku używamy discover endpoint z odpowiednimi parametrami dat
          const now = new Date()
          let fromDate: Date
          
          if (timeWindow === 'month') {
            fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          } else { // year
            fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          }
          
          url = `${tmdb.baseUrl}/discover/movie?api_key=${tmdb.apiKey}&language=pl-PL&sort_by=popularity.desc&primary_release_date.gte=${fromDate.toISOString().split('T')[0]}&primary_release_date.lte=${now.toISOString().split('T')[0]}`
        }
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Nie udało się pobrać filmów')
        }
        
        const data = await response.json()
        setMovies(data.results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [timeWindow]) // Dodajemy timeWindow do zależności useEffect

  const handleTimeWindowChange = (newTimeWindow: TimeWindow) => {
    setTimeWindow(newTimeWindow)
  }

  if (isLoading) {
    return <div className="text-center p-4 text-white">Ładowanie...</div>
  }

  return (
    <div className="space-y-6">
      <TimeWindowSwitch 
        currentTimeWindow={timeWindow}
        onTimeWindowChange={handleTimeWindowChange}
      />
      
      {error ? (
        <div className="text-center p-4">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <Link 
              key={movie.id} 
              href={`/filmy/${movie.id}`}
              className="transition-transform hover:scale-105"
            >
              <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80 h-full">
                <CardContent className="p-4">
                  <div className="aspect-[2/3] relative mb-2">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h2 className="text-white font-semibold truncate">{movie.title}</h2>
                  <p className="text-zinc-400 text-sm">
                    Ocena: {movie.vote_average.toFixed(1)}/10
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

