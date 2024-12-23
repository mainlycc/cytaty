import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Card, CardContent } from "@/app/components/ui/card"    
import { Badge } from "@/app/components/ui/badge"
import { CalendarIcon, Clock, Star } from 'lucide-react'

async function getMovie(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pl-PL`,
    { next: { revalidate: 3600 } }
  )
  
  if (!res.ok) {
    throw new Error('Failed to fetch movie')
  }
  return res.json()
}

export default async function MoviePage({ params }: { params: { id: string } }) {
 const movie = await getMovie(params.id)
  if (!movie) {
   notFound()
 }
  return (
   <div className="container py-6">
     <Card className="max-w-4xl mx-auto bg-black/50 backdrop-blur-sm">
       <CardContent className="p-6">
         <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
           {/* Poster */}
           <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
             <Image
               src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
               alt={movie.title}
               fill
               className="object-cover"
               priority
             />
           </div>
            {/* Info */}
           <div className="space-y-4">
             <h1 className="text-3xl font-bold">{movie.title}</h1>
             
             <div className="flex flex-wrap gap-2">
               {movie.genres?.map((genre: { id: number; name: string }) => (
                 <Badge key={genre.id} variant="secondary">
                   {genre.name}
                 </Badge>
               ))}
             </div>
              <div className="flex gap-4 text-sm text-zinc-400">
               <div className="flex items-center gap-1">
                 <CalendarIcon className="h-4 w-4" />
                 <span>{new Date(movie.release_date).getFullYear()}</span>
               </div>
               <div className="flex items-center gap-1">
                 <Clock className="h-4 w-4" />
                 <span>{movie.runtime} min</span>
               </div>
               <div className="flex items-center gap-1">
                 <Star className="h-4 w-4 text-yellow-500" />
                 <span>{movie.vote_average.toFixed(1)}</span>
               </div>
             </div>
              <div className="space-y-2">
               <h2 className="text-xl font-semibold">Opis</h2>
               <p className="text-zinc-400 leading-relaxed">{movie.overview}</p>
             </div>
              {movie.tagline && (
               <div className="italic text-zinc-500">
                 "{movie.tagline}"
               </div>
             )}
           </div>
         </div>
       </CardContent>
     </Card>
   </div>
 )
}


