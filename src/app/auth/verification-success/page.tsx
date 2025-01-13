"use client"

import { useSearchParams } from "next/navigation"
import { EmailVerificationSuccess } from "@/app/components/email-verification-success"
import React, { Suspense } from 'react'

function VerificationSuccess() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return <EmailVerificationSuccess email={email || ''} />
}

export default function VerificationSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="text-zinc-400">Ładowanie...</div>
    </div>}>
      <VerificationSuccess />
    </Suspense>
  )
} 