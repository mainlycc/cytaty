'use client'

import { useEffect, useState } from 'react'
import { MovieCard } from '@/app/components/ui/movie-card'
import { TimeWindowSwitch } from './time-window-switch'
import { tmdb } from '@/lib/tmdb'
import type { Movie, TimeWindow } from '@/lib/tmdb'

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

  return (
    <div className="space-y-6">
      <TimeWindowSwitch 
        currentTimeWindow={timeWindow}
        onTimeWindowChange={handleTimeWindowChange}
      />
      
      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted aspect-[2/3] rounded-lg" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-4">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}

