// app/page.tsx
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface TMDBResponse {
  results: Movie[];
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getMovies(timeWindow: string): Promise<Movie[]> {
  try {
    let endpoint = '';
    switch (timeWindow) {
      case 'day':
        endpoint = 'trending/movie/day';
        break;
      case 'week':
        endpoint = 'trending/movie/week';
        break;
      default:
        endpoint = 'movie/popular';
    }

    const response = await axios.get<TMDBResponse>(`https://api.themoviedb.org/3/${endpoint}`, {
      params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
        language: 'pl-PL',
      },
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Filmy | Najpopularniejsze filmy',
  description: 'Przeglądaj najpopularniejsze filmy',
};

export default async function MoviesPage({ searchParams }: PageProps) {
  const period = searchParams.period as string || 'popular';
  const movies = await getMovies(period);

  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-red-800/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/30 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="row-start-2 w-full">
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-3xl font-bold text-center mb-6">Najpopularniejsze filmy</h1>
            <div className="flex gap-4">
              <Link 
                href="/filmy?period=popular" 
                className={`px-4 py-2 rounded-lg ${period === 'popular' ? 'bg-white text-black' : 'bg-black/50 text-white border border-white/20'}`}
              >
                Ogólnie
              </Link>
              <Link 
                href="/filmy?period=day" 
                className={`px-4 py-2 rounded-lg ${period === 'day' ? 'bg-white text-black' : 'bg-black/50 text-white border border-white/20'}`}
              >
                Dzisiaj
              </Link>
              <Link 
                href="/filmy?period=week" 
                className={`px-4 py-2 rounded-lg ${period === 'week' ? 'bg-white text-black' : 'bg-black/50 text-white border border-white/20'}`}
              >
                W tym tygodniu
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {movies.map((movie) => (
              <Link 
                href={`/filmy/${movie.id}`}
                key={movie.id}
              >
                <div className="flex flex-col items-center bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-4 transition-transform hover:scale-105 hover:border-white/40">
                  {movie.poster_path && (
                    <div className="relative w-full aspect-[2/3] mb-4">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="rounded-lg object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-center">{movie.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
