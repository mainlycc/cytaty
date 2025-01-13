"use client"

import { useSearchParams } from "next/navigation"
import { EmailVerificationSuccess } from "@/app/components/email-verification-success"
import React from 'react'

export default function VerificationSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return <EmailVerificationSuccess email={email || ''} />
} 