import { LoginForm } from "@/app/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] pointer-events-none" />
      
      <main className="container mx-auto px-4 py-24 relative">
        <div className="max-w-[400px] mx-auto">
          <LoginForm className="w-full" />
        </div>
      </main>
    </div>
  )
}