// app/page.tsx
import { Metadata } from 'next';
import { MovieList } from '@/app/components/movie-list';

export const metadata: Metadata = {
  title: 'Filmy | Najpopularniejsze filmy',
  description: 'Przeglądaj najpopularniejsze filmy',
};

// Najprostsze możliwe podejście
export default function MoviesPage({
  searchParams = {}
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const period = typeof searchParams.period === 'string' ? searchParams.period : 'popular';
  return <MovieList initialPeriod={period} />;
}
