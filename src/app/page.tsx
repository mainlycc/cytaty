'use client'

import { useState, useEffect } from 'react'
import Hero from '@/app/components/ui/hero'
import { Spinner } from '@/app/components/ui/spinner'

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
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-black">
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

