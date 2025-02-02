'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tmdb } from '@/lib/tmdb';
import type { Movie, Genre, ProductionCountry } from '@/lib/tmdb';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

type CastMember = {
  name: string;
  character: string;
};

type Director = {
  name: string;
};

type WatchProvider = {
  provider_name: string;
  logo_path: string;
};

type CrewMember = {
  job: string;
  name: string;
};

type NavigationIds = {
  previousId: string | null;
  nextId: string | null;
};

const countryTranslations: { [key: string]: string } = {
  'United States of America': 'Stany Zjednoczone',
  'United Kingdom': 'Wielka Brytania',
  'France': 'Francja',
  'Germany': 'Niemcy',
  'Italy': 'Włochy',
  'Spain': 'Hiszpania',
  'Poland': 'Polska',
  'Japan': 'Japonia',
  'China': 'Chiny',
  'South Korea': 'Korea Południowa',
  'Russia': 'Rosja',
  'Canada': 'Kanada',
  'Australia': 'Australia',
  'Brazil': 'Brazylia',
  'Mexico': 'Meksyk',
  'India': 'Indie',
  'Sweden': 'Szwecja',
  'Norway': 'Norwegia',
  'Denmark': 'Dania',
  'Netherlands': 'Holandia',
  'Belgium': 'Belgia',
  'Switzerland': 'Szwajcaria',
  'Austria': 'Austria',
  'Ireland': 'Irlandia',
  'New Zealand': 'Nowa Zelandia',
};

export default function MovieDetailsClient() {
  const router = useRouter();
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [director, setDirector] = useState<Director | null>(null);
  const [watchProviders, setWatchProviders] = useState<WatchProvider[]>([]);
  const [navigationIds, setNavigationIds] = useState<NavigationIds>({ previousId: null, nextId: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchMovieDetails() {
      setIsLoading(true);
      setError(null);

      try {
        const [movieResponse, creditsResponse, providersResponse, navigationResponse] = await Promise.all([
          fetch(`${tmdb.baseUrl}/movie/${id}?api_key=${tmdb.apiKey}&language=pl-PL`),
          fetch(`${tmdb.baseUrl}/movie/${id}/credits?api_key=${tmdb.apiKey}&language=pl-PL`),
          fetch(`${tmdb.baseUrl}/movie/${id}/watch/providers?api_key=${tmdb.apiKey}`),
          fetch(`/api/movies/navigation/${id}`) // Endpoint który musisz stworzyć do pobierania ID sąsiednich filmów
        ]);

        if (!movieResponse.ok || !creditsResponse.ok || !providersResponse.ok || !navigationResponse.ok) {
          throw new Error('Nie udało się pobrać szczegółów filmu');
        }

        const movieData = await movieResponse.json();
        const creditsData = await creditsResponse.json();
        const providersData = await providersResponse.json();
        const navigationData = await navigationResponse.json();

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 5)); // Pobierz pierwszych 5 członków obsady
        setDirector(creditsData.crew.find((member: CrewMember) => member.job === 'Director'));
        setWatchProviders(providersData.results.PL?.flatrate || []); // Pobierz platformy dostępne w Polsce
        setNavigationIds(navigationData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  const handleNavigation = (movieId: string | null) => {
    if (movieId) {
      router.push(`/filmy/${movieId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-800/70" />
        <div className="relative p-6 flex items-center justify-center">
          <div className="text-xl text-white">Ładowanie...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-800/70" />
        <div className="relative p-6 flex items-center justify-center">
          <div className="text-center p-4 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-800/70" />
        <div className="relative p-6 flex items-center justify-center">
          <div className="text-center p-4 text-white">Nie znaleziono filmu</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-800/70" />
      
      <div className="relative container mx-auto py-8 max-w-3xl">
        {/* Przyciski nawigacyjne */}
        <div className="fixed top-1/2 -translate-y-1/2 w-screen left-0 px-4 flex justify-between">
          <button
            onClick={() => handleNavigation(navigationIds.previousId)}
            className={`p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors ${!navigationIds.previousId && 'opacity-50 cursor-not-allowed'}`}
            disabled={!navigationIds.previousId}
            aria-label="Poprzedni film"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={() => handleNavigation(navigationIds.nextId)}
            className={`p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors ${!navigationIds.nextId && 'opacity-50 cursor-not-allowed'}`}
            disabled={!navigationIds.nextId}
            aria-label="Następny film"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>

        <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold mb-4 text-white">{movie.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg"
              />
            </div>
            <div className="text-sm text-zinc-300">
              <p className="mb-6">
                <span className="font-bold text-white">Opis:</span>{' '}
                {movie.overview || 'Opis filmu nie jest jeszcze dostępny.'}
              </p>
              <p className="mb-6">
                <span className="font-bold text-white">Data premiery:</span>{' '}
                {movie.release_date || 'Data premiery nie jest jeszcze znana.'}
              </p>
              <p className="mb-6">
                <span className="font-bold text-white">Kraj produkcji:</span>{' '}
                {movie.production_countries?.length > 0
                  ? movie.production_countries
                      .map((country: ProductionCountry) => 
                        countryTranslations[country.name] || country.name
                      )
                      .join(', ')
                  : 'Brak informacji o kraju produkcji.'}
              </p>
              <p className="mb-6">
                <span className="font-bold text-white">Reżyser:</span>{' '}
                {director?.name || 'Informacja o reżyserze nie jest dostępna.'}
              </p>
              <p className="mb-6">
                <span className="font-bold text-white">Gatunki:</span>{' '}
                {movie.genres?.length > 0 
                  ? movie.genres.map((genre: Genre) => genre.name).join(', ')
                  : 'Brak informacji o gatunkach filmu.'}
              </p>
              <p className="mb-6">
                <span className="font-bold text-white">Ocena:</span>{' '}
                {movie.vote_average ? (
                  <span className="inline-flex items-center gap-1">
                    {movie.vote_average.toFixed(1)} / 10
                    <span className="ml-2 flex gap-0.5">
                      {[...Array(5)].map((_, index) => {
                        const starValue = (movie.vote_average / 2);
                        const isHalf = starValue - Math.floor(starValue) >= 0.5;
                        const isFilled = index < Math.floor(starValue);
                        const isHalfFilled = index === Math.floor(starValue) && isHalf;
                        
                        return (
                          <Star
                            key={index}
                            className={`w-5 h-5 ${
                              isFilled
                                ? 'text-yellow-400 fill-yellow-400'
                                : isHalfFilled
                                ? 'text-yellow-400 fill-yellow-400/50'
                                : 'text-yellow-400/30'
                            }`}
                          />
                        );
                      })}
                    </span>
                  </span>
                ) : (
                  'Film nie został jeszcze oceniony.'
                )}
              </p>
              <p className="mb-6">
                <span className="font-bold text-white">Obsada:</span>
              </p>
              {cast.length > 0 ? (
                <ul className="list-disc list-inside mb-6 text-zinc-300">
                  {cast.map((member) => (
                    <li key={member.name}>
                      <span className="text-white">{member.name}</span> jako {member.character}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-6 text-zinc-400 italic">Informacje o obsadzie nie są jeszcze dostępne.</p>
              )}
              <p className="mb-6">
                <span className="font-bold text-white">Dostępne na platformach:</span>
              </p>
              <div className="flex space-x-2">
                {watchProviders.length > 0 ? (
                  watchProviders.map((provider) => (
                    <div key={provider.provider_name} className="relative group">
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        width={45}
                        height={45}
                        className="rounded transition-transform hover:scale-110"
                      />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap">
                        {provider.provider_name}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400 italic">Film nie jest obecnie dostępny na żadnej platformie streamingowej w Polsce.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 