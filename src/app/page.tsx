'use client'

import { useState, useEffect } from 'react'
import Hero from '@/app/components/ui/hero'
import { Spinner } from '@/app/components/ui/spinner'
import { Star, StarHalf } from 'lucide-react'

const RatingStars = ({ rating }: { rating: number }) => {
  const normalizedRating = rating / 2;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 fill-yellow-500 text-yellow-500" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-zinc-600" />
      ))}
      <span className="ml-1 text-sm text-zinc-300">({rating.toFixed(1)})</span>
    </div>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkIfLoaded = () => {
      if (document.readyState === 'complete') {
        setIsLoading(false)
      }
    }

    checkIfLoaded()
    document.addEventListener('readystatechange', checkIfLoaded)

    return () => {
      document.removeEventListener('readystatechange', checkIfLoaded)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-red-950 to-zinc-950">
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <Spinner 
            size="lg"
            className="bg-red-500"
            loading={isLoading}
          />
        </div>
      ) : (
        <Hero />
      )}
    </div>
  )
}
