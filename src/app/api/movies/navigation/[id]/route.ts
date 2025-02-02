import { NextResponse } from 'next/server';
import { tmdb } from '@/lib/tmdb';
export async function GET(
  request: Request,
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

    const data = await response.json();
    const movies = data.results;
    
    // Znajdź indeks obecnego filmu
    const currentIndex = movies.findIndex((movie: any) => movie.id.toString() === params.id);
    
    // Określ ID poprzedniego i następnego filmu
    const previousId = currentIndex > 0 ? movies[currentIndex - 1].id.toString() : null;
    const nextId = currentIndex < movies.length - 1 ? movies[currentIndex + 1].id.toString() : null;

    return NextResponse.json({ previousId, nextId });
  } catch (error) {
    return NextResponse.json({ previousId: null, nextId: null }, { status: 500 });
  }
} 