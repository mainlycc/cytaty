'use client'

import { useState, useEffect } from 'react'
import { Spinner } from '@/app/components/ui/spinner'
import dynamic from 'next/dynamic'

const Hero = dynamic(() => import('./components/ui/hero'), {
  ssr: true,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <Spinner size="lg" className="bg-red-500" loading={true} />
    </div>
  )
})

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
