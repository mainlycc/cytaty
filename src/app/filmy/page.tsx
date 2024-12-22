// app/page.tsx
import { Metadata } from 'next';
import { MovieList } from '@/app/components/movie-list';

export const metadata: Metadata = {
  title: 'Filmy | Najpopularniejsze filmy',
  description: 'Przeglądaj najpopularniejsze filmy',
};

// Uproszczony komponent strony
export default function MoviesPage({
  searchParams,
}: {
  searchParams: { period?: string }
}) {
  return <MovieList initialPeriod={searchParams.period || 'popular'} />;
}
