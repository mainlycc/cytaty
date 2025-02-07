import { NextRequest, NextResponse } from 'next/server';
import { tmdb } from '@/lib/tmdb';

interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  original_title: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Pobierz listę filmów z tym samym sortowaniem jak na stronie głównej
    const response = await fetch(
      `${tmdb.baseUrl}/movie/popular?api_key=${tmdb.apiKey}&language=pl-PL`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data = await response.json() as TMDBResponse;
    const movies = data.results;
    
    // Znajdź indeks obecnego filmu
    const currentIndex = movies.findIndex((movie) => movie.id.toString() === params.id);
    
    // Określ ID poprzedniego i następnego filmu
    const previousId = currentIndex > 0 ? movies[currentIndex - 1].id.toString() : null;
    const nextId = currentIndex < movies.length - 1 ? movies[currentIndex + 1].id.toString() : null;

    return NextResponse.json({ previousId, nextId });
  } catch {
    return NextResponse.json({ previousId: null, nextId: null }, { status: 500 });
  }
}