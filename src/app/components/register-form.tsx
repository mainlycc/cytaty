"use client"

import * as React from "react"
import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export function RegisterForm({
 className,
 ...props
}: React.ComponentPropsWithoutRef<"div">): React.JSX.Element {
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [confirmPassword, setConfirmPassword] = useState("")
 const [showPassword, setShowPassword] = useState(false)
 const [showConfirmPassword, setShowConfirmPassword] = useState(false)
 const [loading, setLoading] = useState(false)
 const [isRegistered, setIsRegistered] = useState(false)
 const [username, setUsername] = useState("")
 const router = useRouter()
 const supabase = createClientComponentClient()

 const validatePassword = (password: string) => {
   const minLength = 8;
   const hasUpperCase = /[A-Z]/.test(password);
   const hasLowerCase = /[a-z]/.test(password);
   const hasNumbers = /\d/.test(password);
   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

   const errors = [];
   
   if (password.length < minLength) errors.push("minimum 8 znaków");
   if (!hasUpperCase) errors.push("przynajmniej 1 wielką literę");
   if (!hasLowerCase) errors.push("przynajmniej 1 małą literę");
   if (!hasNumbers) errors.push("przynajmniej 1 cyfrę");
   if (!hasSpecialChar) errors.push("przynajmniej 1 znak specjalny");

   return {
     isValid: errors.length === 0,
     errors
   };
 };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault()
   setLoading(true)
   
   const passwordValidation = validatePassword(password);
   if (!passwordValidation.isValid) {
     toast.error(
       <div>
         Hasło musi zawierać:
         <ul className="list-disc pl-4 mt-2">
           {passwordValidation.errors.map((error, index) => (
             <li key={index}>{error}</li>
           ))}
         </ul>
       </div>
     );
     setLoading(false);
     return;
   }

   if (password !== confirmPassword) {
     toast.error("Hasła nie są identyczne")
     setLoading(false)
     return
   }
   
   try {
     const { data, error: _error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         emailRedirectTo: `${window.location.origin}/auth/callback`,
         data: {
           username: username,
         }
       }
     })
     
     if (_error) {
       console.error('Błąd rejestracji:', _error)
       toast.error("Nie udało się utworzyć konta. Spróbuj ponownie później.")
       setLoading(false)
       return
     }

     if (data?.user?.identities?.length === 0) {
       toast.error("Ten email jest już zarejestrowany. Spróbuj się zalogować lub zresetować hasło.")
       setLoading(false)
       return
     }

     if (!data.user) {
       toast.error("Nie udało się utworzyć konta. Sprawdź poprawność danych i spróbuj ponownie.")
       setLoading(false)
       return
     }

     console.log('Sukces rejestracji:', data)
     setIsRegistered(true)
     toast.success("Konto zostało utworzone!", { duration: 3000 })

   } catch (error) {
     console.error('Nieoczekiwany błąd:', error)
     toast.error("Wystąpił nieoczekiwany błąd podczas rejestracji. Spróbuj ponownie później.")
   } finally {
     setLoading(false)
   }
 }

 const handleGoogleSignUp = async () => {
   try {
     setLoading(true)
     const { error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: {
         redirectTo: `${window.location.origin}/auth/callback`,
         queryParams: {
           access_type: 'offline',
           prompt: 'consent',
         },
       },
     })

     if (error) throw error
   } catch (error) {
     console.error('Błąd rejestracji przez Google:', error)
     toast.error('Wystąpił błąd podczas rejestracji przez Google')
   } finally {
     setLoading(false)
   }
 }

 if (isRegistered) {
   return (
     <div className={cn("flex flex-col gap-6", className)} {...props}>
       <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
         <CardHeader className="text-center">
           <CardTitle className="text-xl text-zinc-100">
             Rejestracja zakończona pomyślnie!
           </CardTitle>
           <CardDescription className="text-zinc-400">
             Potwierdź swój adres email
           </CardDescription>
         </CardHeader>
         <CardContent className="text-center space-y-4">
           <div className="text-zinc-300">
             Na adres <span className="font-semibold text-red-400">{email}</span> został wysłany link aktywacyjny.
           </div>
           <div className="text-zinc-400 text-sm">
             Sprawdź swoją skrzynkę odbiorczą i kliknij w link, aby potwierdzić rejestrację.
           </div>
           <div className="text-zinc-500 text-xs">
             Jeśli nie widzisz wiadomości, sprawdź folder spam.
           </div>
           <Button
             variant="outline"
             className="mt-4 w-full bg-zinc-900/50 border-zinc-800/80 text-zinc-100 hover:bg-zinc-900/80"
             onClick={() => router.push("/auth/login")}
           >
             Przejdź do logowania
           </Button>
         </CardContent>
       </Card>
     </div>
   )
 }

 return (
   <div className={cn("grid gap-6", className)} {...props}>
     <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
       <CardHeader className="space-y-1">
         <CardTitle className="text-2xl text-zinc-100">Zarejestruj się</CardTitle>
         <CardDescription className="text-zinc-400">
           Wybierz metodę rejestracji
         </CardDescription>
       </CardHeader>
       <CardContent className="grid gap-4">
         <Button
           variant="outline"
           className="bg-white text-black hover:bg-zinc-100 border-zinc-200"
           onClick={handleGoogleSignUp}
           disabled={loading}
         >
           <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
             <path
               d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
               fill="#4285F4"
             />
             <path
               d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
               fill="#34A853"
             />
             <path
               d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
               fill="#FBBC05"
             />
             <path
               d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
               fill="#EA4335"
             />
           </svg>
           {loading ? "Rejestracja..." : "Kontynuuj z Google"}
         </Button>

         <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-zinc-800/80">
           <span className="relative z-10 bg-black/50 px-2 text-zinc-400">
             Lub kontynuuj przez email
           </span>
         </div>

         <form onSubmit={handleSubmit}>
           <div className="grid gap-6">
             <div className="grid gap-2">
               <Label htmlFor="username" className="text-zinc-400">Nazwa użytkownika</Label>
               <Input
                 id="username"
                 type="text"
                 placeholder="Twoja nazwa użytkownika"
                 required
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100 placeholder:text-zinc-500"
                 disabled={loading}
               />
             </div>
             <div className="grid gap-2">
               <Label htmlFor="email" className="text-zinc-400">Email</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="m@example.com"
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100 placeholder:text-zinc-500"
               />
             </div>
             <div className="grid gap-2">
               <Label htmlFor="password" className="text-zinc-400">Hasło</Label>
               <div className="relative">
                 <Input
                   id="password"
                   type={showPassword ? "text" : "password"}
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
                   disabled={loading}
                 />
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-zinc-400 hover:text-zinc-100"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? (
                     <EyeOff className="h-4 w-4" />
                   ) : (
                     <Eye className="h-4 w-4" />
                   )}
                 </Button>
               </div>
               <p className="text-xs text-zinc-500">
                 Hasło musi zawierać minimum 8 znaków, w tym przynajmniej: 1 wielką literę, 
                 1 małą literę, 1 cyfrę i 1 znak specjalny (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)
               </p>
             </div>
             <div className="grid gap-2">
               <Label htmlFor="confirmPassword" className="text-zinc-400">Potwierdź hasło</Label>
               <div className="relative">
                 <Input
                   id="confirmPassword"
                   type={showConfirmPassword ? "text" : "password"}
                   required
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100"
                   disabled={loading}
                 />
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-zinc-400 hover:text-zinc-100"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                 >
                   {showConfirmPassword ? (
                     <EyeOff className="h-4 w-4" />
                   ) : (
                     <Eye className="h-4 w-4" />
                   )}
                 </Button>
               </div>
             </div>
             <Button type="submit" className="w-full bg-red-500/80 hover:bg-red-500 text-white border-none" disabled={loading}>
               {loading ? "Rejestracja..." : "Zarejestruj się"}
             </Button>
           </div>
         </form>
       </CardContent>
     </Card>
     <div className="text-balance text-center text-xs text-zinc-500 [&_a]:text-red-400 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-red-300">
       Klikając zarejestruj się, akceptujesz nasz{" "}
       <Link href="/regulamin">Regulamin</Link> oraz{" "}
       <Link href="/polityka-prywatnosci">Politykę Prywatności</Link>.
     </div>
   </div>
 )
}