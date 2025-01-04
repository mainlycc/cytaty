'use client'

import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import { useEffect, useState } from 'react'

export function I18NProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initI18n = async () => {
      try {
        await i18n.init()
        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing i18n:', error)
      }
    }

    if (!i18n.isInitialized) {
      initI18n()
    } else {
      setIsInitialized(true)
    }
  }, [])

  if (!isInitialized) {
    return <div>Loading translations...</div>
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
} 