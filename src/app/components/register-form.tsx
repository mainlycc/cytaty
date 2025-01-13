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
  const handleOAuthSignUp = async (provider: 'google' | 'apple') => {
   try {
     const { error: _error } = await supabase.auth.signInWithOAuth({
       provider,
       options: {
         redirectTo: `${window.location.origin}/auth/callback`
       }
     })
     
     if (_error) {
       toast.error(_error.message)
     }
   } catch {
     toast.error("Wystąpił błąd podczas rejestracji")
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
   <div className={cn("flex flex-col gap-6", className)} {...props}>
     <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
       <CardHeader className="text-center">
         <CardTitle className="text-xl text-zinc-100">Stwórz konto</CardTitle>
         <CardDescription className="text-zinc-400">
           Zarejestruj się przez Apple lub Google
         </CardDescription>
       </CardHeader>
       <CardContent>
         <form onSubmit={handleSubmit}>
           <div className="grid gap-6">
             <div className="flex flex-col gap-4">
               <Button 
                 variant="outline" 
                 className="w-full bg-zinc-900/50 border-zinc-800/80 text-zinc-100 hover:bg-zinc-900/80" 
                 onClick={() => handleOAuthSignUp('apple')}
                 type="button"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                   <path
                     d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                     fill="currentColor"
                   />
                 </svg>
                 Zarejestruj przez Apple
               </Button>
               <Button 
                 variant="outline" 
                 className="w-full bg-zinc-900/50 border-zinc-800/80 text-zinc-100 hover:bg-zinc-900/80"
                 onClick={() => handleOAuthSignUp('google')}
                 type="button"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                   <path
                     d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                     fill="currentColor"
                   />
                 </svg>
                 Zarejestruj przez Google
               </Button>
             </div>
             <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-zinc-800/80">
               <span className="relative z-10 bg-black/50 px-2 text-zinc-400">
                 Lub kontynuuj przez email
               </span>
             </div>
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
                   1 małą literę, 1 cyfrę i 1 znak specjalny (!@#$%^&*(),.?":{}|&lt;&gt;)
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
             <div className="text-center text-sm text-zinc-400">
               Masz już konto?{" "}
               <Link href="/auth/login" className="text-red-400 hover:text-red-300 underline underline-offset-4">
                 Zaloguj się
               </Link>
             </div>
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