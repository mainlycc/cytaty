const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export type TimeWindow = 'day' | 'week' | 'month' | 'year'

export const timeWindows: { label: string; value: TimeWindow }[] = [
  { label: 'Dzisiaj', value: 'day' },
  { label: 'Tydzień', value: 'week' },
  { label: 'Miesiąc', value: 'month' },
  { label: 'Rok', value: 'year' }
]

export const tmdb = {
  apiKey: TMDB_API_KEY,
  baseUrl: TMDB_BASE_URL,
  imageBaseUrl: TMDB_IMAGE_BASE_URL,
  posterSizes: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  }
}

export type Movie = {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
}

