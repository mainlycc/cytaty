'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react'
import { TimeWindowSwitch } from './time-window-switch'
import { tmdb } from '@/lib/tmdb'
import type { Movie, TimeWindow } from '@/lib/tmdb'
import { Card, CardContent } from './card'
import Image from 'next/image'

interface Genre {
  id: number;
  name: string;
}

interface SortOption {
  id: string;
  name: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxVisiblePages = 5;
  const pages = [];
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-black/50 text-white border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Pierwsza strona"
      >
        «
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-black/50 text-white border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Poprzednia strona"
      >
        ‹
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg bg-black/50 text-white border border-white/20"
          >
            1
          </button>
          {startPage > 2 && <span className="text-white">...</span>}
        </>
      )}
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition-colors ${
            currentPage === page
              ? 'bg-white text-black'
              : 'bg-black/50 text-white border border-white/20'
          }`}
          aria-label={`Strona ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-white">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-lg bg-black/50 text-white border border-white/20"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-black/50 text-white border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Następna strona"
      >
        ›
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-black/50 text-white border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Ostatnia strona"
      >
        »
      </button>
    </div>
  );
}

export function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('week')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Pobieranie gatunków
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch(
          `${tmdb.baseUrl}/genre/movie/list?api_key=${tmdb.apiKey}&language=pl-PL`
        );
        if (!response.ok) {
          throw new Error('Nie udało się pobrać gatunków');
        }
        const data = await response.json();
        setGenres(data.genres);
      } catch (err) {
        console.error('Błąd podczas pobierania gatunków:', err);
      }
    }

    fetchGenres();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true)
      setError(null)
      
      try {
        let url: string
        const params = new URLSearchParams({
          api_key: tmdb.apiKey || '',
          language: 'pl-PL',
          page: currentPage.toString(),
        } as Record<string, string>);
        
        if (selectedGenre) {
          params.append('with_genres', selectedGenre.toString());
        }
        
        // Różne endpointy dla różnych przedziałów czasowych
        if (timeWindow === 'day' || timeWindow === 'week') {
          url = `${tmdb.baseUrl}/trending/movie/${timeWindow}?${params}`
        } else {
          const now = new Date()
          let fromDate: Date
          
          if (timeWindow === 'month') {
            fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          } else { // year
            fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          }
          
          params.append('primary_release_date.gte', fromDate.toISOString().split('T')[0]);
          params.append('primary_release_date.lte', now.toISOString().split('T')[0]);
          url = `${tmdb.baseUrl}/discover/movie?${params}`
        }
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Nie udało się pobrać filmów')
        }
        
        const data = await response.json()
        setMovies(data.results)
        setTotalPages(Math.min(data.total_pages, 500))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [timeWindow, selectedGenre, currentPage])

  const handleTimeWindowChange = (newTimeWindow: TimeWindow) => {
    setTimeWindow(newTimeWindow)
  }

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setCurrentPage(1); // Reset strony przy zmianie gatunku
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <div className="text-center p-4 text-white">Ładowanie...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-white">
          Popularne filmy
        </h1>
        
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleTimeWindowChange('day')}
              disabled={selectedGenre !== null}
              className={`
                inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
                ${selectedGenre !== null
                  ? 'bg-black/20 text-white/40 cursor-not-allowed'
                  : timeWindow === 'day'
                    ? 'bg-white text-black shadow-lg shadow-white/20' 
                    : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
                }
              `}
              aria-label="Pokaż popularne filmy z dzisiaj"
              title={selectedGenre !== null ? "Niedostępne przy wybranym gatunku" : ""}
            >
              Dzisiaj
            </button>
            <button
              onClick={() => handleTimeWindowChange('week')}
              disabled={selectedGenre !== null}
              className={`
                inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
                ${selectedGenre !== null
                  ? 'bg-black/20 text-white/40 cursor-not-allowed'
                  : timeWindow === 'week'
                    ? 'bg-white text-black shadow-lg shadow-white/20' 
                    : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
                }
              `}
              aria-label="Pokaż popularne filmy z tego tygodnia"
              title={selectedGenre !== null ? "Niedostępne przy wybranym gatunku" : ""}
            >
              Ten tydzień
            </button>
            <button
              onClick={() => handleTimeWindowChange('month')}
              className={`
                inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
                ${timeWindow === 'month'
                  ? 'bg-white text-black shadow-lg shadow-white/20' 
                  : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
                }
              `}
              aria-label="Pokaż popularne filmy z tego miesiąca"
            >
              Ten miesiąc
            </button>
            <button
              onClick={() => handleTimeWindowChange('year')}
              className={`
                inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
                ${timeWindow === 'year'
                  ? 'bg-white text-black shadow-lg shadow-white/20' 
                  : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
                }
              `}
              aria-label="Pokaż popularne filmy z tego roku"
            >
              Ten rok
            </button>
          </div>

          <div className="w-full max-w-4xl px-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto px-4">
            <button
              onClick={() => handleGenreSelect(null)}
              className={`
                inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
                ${selectedGenre === null
                  ? 'bg-white text-black shadow-lg shadow-white/20' 
                  : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
                }
              `}
              aria-label="Pokaż wszystkie gatunki"
            >
              Wszystkie
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className={`
                  group relative inline-flex items-center text-sm px-3 py-1 rounded-full transition-all
                  ${selectedGenre === genre.id
                    ? 'bg-white text-black shadow-lg shadow-white/20' 
                    : 'bg-black/30 text-white/80 hover:bg-black/40 hover:text-white border border-white/10'
                  }
                `}
                aria-label={`Pokaż filmy z gatunku ${genre.name}`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {error ? (
        <div className="text-center p-4">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
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
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

