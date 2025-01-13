"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface EmailVerificationSuccessProps extends React.ComponentPropsWithoutRef<"div"> {
  email?: string
}

export function EmailVerificationSuccess({ className, email, ...props }: EmailVerificationSuccessProps) {
  const router = useRouter()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-zinc-100">
            Email został potwierdzony!
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Możesz się teraz zalogować
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-zinc-300">
            Adres <span className="font-semibold text-red-400">{email}</span> został pomyślnie zweryfikowany.
          </div>
          <Button
            className="mt-4 w-full bg-red-500/80 hover:bg-red-500 text-white border-none"
            onClick={() => router.push("/auth/login")}
          >
            Przejdź do logowania
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 