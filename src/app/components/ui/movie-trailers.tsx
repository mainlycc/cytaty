'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './card'
import { Skeleton } from './skeleton'
import { Alert, AlertDescription } from './alert'
import { Button } from './button'
import { ChevronLeft, ChevronRight, AlertCircle, PlayCircle, Film, ExternalLink } from 'lucide-react'
import Image from 'next/image'

// Typy danych dla zwiastunów
interface MovieVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
  movie: {
    id: number
    title: string
    poster_path: string
  }
}

// Cache dla zapisywania wyników
let cachedVideos: MovieVideo[] = [];

// Ile zwiastunów na stronę
const VIDEOS_PER_PAGE = 6;

/**
 * Komponent wyświetlający najnowsze zwiastuny filmów w formie siatki
 */
export function MovieTrailers() {
  const [videos, setVideos] = useState<MovieVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [debug, setDebug] = useState<string>("")
  const [selectedVideo, setSelectedVideo] = useState<MovieVideo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Pobranie listy najnowszych filmów i ich zwiastunów
  useEffect(() => {
    // Funkcja do bezpośredniego pobierania popularnych zwiastunów
    const fetchPopularTrailers = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Jeśli mamy już cache, użyjmy go
        if (cachedVideos.length > 0) {
          console.log("Używam danych z cache", cachedVideos.length);
          setDebug(prev => prev + "\nUżywam danych z cache: " + cachedVideos.length);
          setVideos(cachedVideos);
          setIsLoading(false);
          return;
        }

        // Pobierz listę popularnych filmów
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
          throw new Error('Brak klucza API');
        }
        
        setDebug(prev => prev + "\nKlucz API znaleziony");
        
        const moviesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pl-PL`,
          { headers: { 'Accept': 'application/json' } }
        );
        
        if (!moviesResponse.ok) {
          throw new Error(`Nie udało się pobrać listy filmów: ${moviesResponse.status}`);
        }
        
        const moviesData = await moviesResponse.json();
        
        if (!moviesData.results || !Array.isArray(moviesData.results)) {
          throw new Error('Nieprawidłowa odpowiedź API dla filmów');
        }
        
        setDebug(prev => prev + `\nPobrano ${moviesData.results.length} filmów`);
        
        // Pobierz zwiastuny dla każdego filmu
        const allVideos: MovieVideo[] = [];
        const movies = moviesData.results.slice(0, 20); // Pobierz zwiastuny dla 20 popularnych filmów
        
        for (const movie of movies) {
          try {
            // Najpierw próbujemy pobrać zwiastuny w języku polskim
            const videosResponsePL = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=pl-PL`,
              { headers: { 'Accept': 'application/json' } }
            );
            
            let videosPL: any[] = [];
            if (videosResponsePL.ok) {
              const videosDataPL = await videosResponsePL.json();
              if (videosDataPL.results && Array.isArray(videosDataPL.results)) {
                videosPL = videosDataPL.results;
              }
            }
            
            // Następnie pobieramy zwiastuny w języku angielskim
            const videosResponseEN = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`,
              { headers: { 'Accept': 'application/json' } }
            );
            
            let videosEN: any[] = [];
            if (videosResponseEN.ok) {
              const videosDataEN = await videosResponseEN.json();
              if (videosDataEN.results && Array.isArray(videosDataEN.results)) {
                videosEN = videosDataEN.results;
              }
            }
            
            // Łączymy wyniki, priorytetyzując polskie
            const combinedVideos = [...videosPL];
            
            // Dodajemy angielskie zwiastuny, które nie mają odpowiedników w polskich (po kluczu)
            const plKeys = new Set(videosPL.map(v => v.key));
            for (const enVideo of videosEN) {
              if (!plKeys.has(enVideo.key)) {
                combinedVideos.push(enVideo);
              }
            }
            
            if (combinedVideos.length > 0) {
              // Filtruj tylko zwiastuny z YouTube i tylko typ "Trailer"
              const youtubeTrailers = combinedVideos.filter(
                (video: any) => video.site === 'YouTube' && video.type === 'Trailer'
              );
              
              // Dodaj informacje o filmie do każdego zwiastuna
              const movieVideos = youtubeTrailers.map((video: any) => ({
                ...video,
                movie: {
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path
                }
              }));
              
              allVideos.push(...movieVideos);
              setDebug(prev => prev + `\nDodano ${movieVideos.length} zwiastunów dla filmu ${movie.title}`);
            }
          } catch (err) {
            console.error(`Błąd pobierania zwiastunów dla filmu ${movie.title}:`, err);
          }
        }
        
        // Sortuj według daty publikacji (od najnowszych)
        const sortedVideos = allVideos.sort((a, b) => 
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
        
        if (sortedVideos.length === 0) {
          throw new Error('Nie znaleziono żadnych zwiastunów');
        }
        
        setDebug(prev => prev + `\nŁącznie znaleziono ${sortedVideos.length} zwiastunów`);
        
        // Zapisz do cache
        cachedVideos = sortedVideos;
        
        setVideos(sortedVideos);
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
        console.error('Błąd podczas pobierania zwiastunów:', err);
        setError(`Wystąpił błąd podczas pobierania zwiastunów: ${errorMessage}`);
        setDebug(prev => prev + `\nBŁĄD: ${errorMessage}`);
        setIsLoading(false);
      }
    };
    
    fetchPopularTrailers();
  }, []);
  
  // Obliczanie paginacji
  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = videos.slice(
    (page - 1) * VIDEOS_PER_PAGE, 
    page * VIDEOS_PER_PAGE
  );
  
  // Nawigacja po stronach
  const handlePreviousPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };
  
  const handleNextPage = () => {
    setPage(prev => Math.min(totalPages, prev + 1));
  };
  
  // Formatowanie daty
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pl-PL', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }).format(date);
    } catch (e) {
      return 'Data nieznana';
    }
  };
  
  // Obsługa modalu dla zwiastunów
  const openVideoModal = (video: MovieVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };
  
  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };
  
  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-white">Najnowsze zwiastuny</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(VIDEOS_PER_PAGE).fill(0).map((_, i) => (
            <div key={i} className="aspect-video">
              <Skeleton className="w-full h-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          {/* Panel debug */}
          <div className="bg-black/60 p-4 rounded-md text-white/70 font-mono text-xs">
            <h4 className="font-bold mb-2">Informacje debugowania:</h4>
            <pre className="whitespace-pre-wrap">{debug || 'Brak danych debugowania'}</pre>
          </div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-10 text-white">
          <Film className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Brak dostępnych zwiastunów.</p>
          <p className="mt-4 text-white/50">Spróbuj ponownie później.</p>
        </div>
      ) : (
        <>
          {/* Siatka zwiastunów */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedVideos.map((video) => (
              <Card 
                key={video.id} 
                className="overflow-hidden border-0 shadow-lg rounded-xl bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors group"
              >
                <CardContent className="p-0">
                  <div 
                    className="aspect-video w-full relative cursor-pointer" 
                    onClick={() => openVideoModal(video)}
                  >
                    {/* Miniatura YouTube */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                    <Image
                      src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                      alt={video.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-16 h-16 rounded-full bg-red-600/80 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        <PlayCircle className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-black/50">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-bold text-white truncate">
                        {video.movie.title}
                      </h3>
                    </div>
                    <p className="text-xs text-white/70 line-clamp-1">
                      {video.name}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {formatDate(video.published_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Paginacja */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="bg-black/30 border-white/20 text-white hover:bg-black/50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Poprzednia
              </Button>
              
              <span className="text-white/80 text-sm">
                Strona {page} z {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="bg-black/30 border-white/20 text-white hover:bg-black/50"
              >
                Następna
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
          
          {/* Wyświetl panel debugowania jeśli jest mało zwiastunów */}
          {videos.length < 5 && (
            <div className="mt-4 bg-black/60 p-4 rounded-md text-white/70 font-mono text-xs">
              <h4 className="font-bold mb-2">Informacje debugowania:</h4>
              <pre className="whitespace-pre-wrap">{debug || 'Brak danych debugowania'}</pre>
            </div>
          )}
        </>
      )}
      
      {/* Modal z odtwarzaczem */}
      {isModalOpen && selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeVideoModal}
        >
          <div 
            className="relative w-full max-w-5xl bg-black/70 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeVideoModal}
                className="rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <span className="sr-only">Zamknij</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
            
            <div className="aspect-video w-full">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                title={selectedVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            
            <div className="p-4 bg-black/70">
              <h3 className="text-xl font-bold text-white">
                {selectedVideo.movie.title} - {selectedVideo.name}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-white/70">
                  Opublikowano: {formatDate(selectedVideo.published_at)}
                </p>
                <a 
                  href={`https://youtube.com/watch?v=${selectedVideo.key}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-white/80 hover:text-white text-sm gap-1"
                >
                  <span>Oglądaj na YouTube</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 