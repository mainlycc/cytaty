'use client'

import React from 'react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

// Tworzymy prosty komponent zastępczy dla Toaster, który nie używa komponentu Toaster bezpośrednio
export function ToasterProvider() {
  // Renderujemy pusty div, ponieważ toast API z sonner działa bez konieczności renderowania 
  // komponenta Toaster w React 19
  return <div id="sonner-provider" className="hidden" />
}

// Komponent kliencki z dynamicznym importem
export const ToasterContainerClient = dynamic(
  () => Promise.resolve(() => <ToasterProvider />),
  { ssr: false }
)

// Eksportujemy pomocnicze funkcje do pokazywania powiadomień
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message)
} 