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
  overview: string
  genres: { id: number; name: string }[]
}

export const fetchUpcomingMovies = async () => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=pl-PL&region=PL`,
    {
      headers: {
        'Accept': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch upcoming movies')
  }

  const data = await response.json()
  return data.results.slice(0, 3).map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    poster_url: `${TMDB_IMAGE_BASE_URL}/${tmdb.posterSizes.medium}${movie.poster_path}`,
    premiere_date: movie.release_date
  }))
}

