"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { useRouter } from "next/navigation"
import React from 'react'

export default function VerificationErrorPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-zinc-100">
            Wystąpił błąd podczas weryfikacji
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-zinc-300">
            Nie udało się zweryfikować Twojego adresu email. Spróbuj ponownie później.
          </div>
          <Button
            className="mt-4 w-full bg-red-500/80 hover:bg-red-500 text-white border-none"
            onClick={() => router.push("/auth/login")}
          >
            Wróć do logowania
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 