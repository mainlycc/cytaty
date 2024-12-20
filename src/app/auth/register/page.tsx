import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"
import { Toaster } from "sonner"
import { RegisterForm } from "@/app/components/register-form"
export default async function RegisterPage() {
 const supabase = createServerComponentClient({ cookies })
 
 const { data: { session } } = await supabase.auth.getSession()
 
 if (session) {
   redirect("/dashboard")
 }
  return (
   <>
     <Toaster />
     <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
       <div className="flex w-full max-w-sm flex-col gap-6">
         <a href="/" className="flex items-center gap-2 self-center font-medium">
           <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
             <GalleryVerticalEnd className="size-4" />
           </div>
           Cytaty
         </a>
         <RegisterForm />
       </div>
     </div>
   </>
 )
}