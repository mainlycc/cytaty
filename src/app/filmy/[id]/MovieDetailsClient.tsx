'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tmdb } from '@/lib/tmdb';
import type { Movie } from '@/lib/tmdb';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import Image from 'next/image';

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

type Genre = {
  id: number;
  name: string;
};

type CrewMember = {
  job: string;
  name: string;
  // Dodaj inne właściwości, które są potrzebne
};

export default function MovieDetailsClient() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [director, setDirector] = useState<Director | null>(null);
  const [watchProviders, setWatchProviders] = useState<WatchProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchMovieDetails() {
      setIsLoading(true);
      setError(null);

      try {
        const [movieResponse, creditsResponse, providersResponse] = await Promise.all([
          fetch(`${tmdb.baseUrl}/movie/${id}?api_key=${tmdb.apiKey}&language=pl-PL`),
          fetch(`${tmdb.baseUrl}/movie/${id}/credits?api_key=${tmdb.apiKey}&language=pl-PL`),
          fetch(`${tmdb.baseUrl}/movie/${id}/watch/providers?api_key=${tmdb.apiKey}`)
        ]);

        if (!movieResponse.ok || !creditsResponse.ok || !providersResponse.ok) {
          throw new Error('Nie udało się pobrać szczegółów filmu');
        }

        const movieData = await movieResponse.json();
        const creditsData = await creditsResponse.json();
        const providersData = await providersResponse.json();

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 5)); // Pobierz pierwszych 5 członków obsady
        setDirector(creditsData.crew.find((member: CrewMember) => member.job === 'Director'));
        setWatchProviders(providersData.results.PL?.flatrate || []); // Pobierz platformy dostępne w Polsce
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

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
        <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
          <CardHeader>
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
                <span className="font-bold text-white">Opis:</span> {movie.overview}
              </p>
              <p className="mb-6">
                <span className="font-bold text-white">Data premiery:</span> {movie.release_date}
              </p>
              {director && (
                <p className="mb-6">
                  <span className="font-bold text-white">Reżyser:</span> {director.name}
                </p>
              )}
              <p className="mb-6">
                <span className="font-bold text-white">Gatunki:</span> {movie.genres.map((genre: Genre) => genre.name).join(', ')}
              </p>
              <p className="mb-6">
                <span className="font-bold text-white">Ocena:</span> {movie.vote_average} / 10
              </p>
              <p className="mb-6">
                <span className="font-bold text-white">Obsada:</span>
              </p>
              <ul className="list-disc list-inside mb-6 text-zinc-300">
                {cast.map((member) => (
                  <li key={member.name}>
                    <span className="text-white">{member.name}</span> jako {member.character}
                  </li>
                ))}
              </ul>
              <p className="mb-6">
                <span className="font-bold text-white">Dostępne na platformach:</span>
              </p>
              <div className="flex space-x-2">
                {watchProviders.map((provider) => (
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
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 