"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { ChevronDown, LogIn, LogOut } from 'lucide-react'
import Image from "next/image"

const NavItem = ({ href, children, items }: { href: string; children: React.ReactNode; items?: { title: string; href: string }[] }) => {
  if (items) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-full px-4 py-2 text-white hover:text-red-500 transition-colors text-base">
            {children} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 rounded-md">
          {items.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="block px-4 py-2 text-base text-white hover:bg-red-500/20">
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button variant="ghost" asChild className="h-full px-4 py-2 text-white hover:text-red-500 transition-colors text-base">
      <Link href={href}>{children}</Link>
    </Button>
  )
}

export function NavMenu() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<{ username?: string, avatar?: string | null } | null>(null)
  const supabase = createClientComponentClient()

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setIsLoggedIn(!!session)
    
    if (session?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('username, avatar')
        .eq('id', session.user.id)
        .single()
      
      setUserData(userData)
    }
  }

  useEffect(() => {
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      if (session?.user) {
        checkAuth()
      } else {
        setUserData(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    router.push('/auth/signout')
  }

  return (
    <div className="bg-black/100 backdrop-blur-sm fixed w-full z-10">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Cytaty z filmów"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </Link>
          <div className="flex-1 flex items-center justify-center space-x-4 lg:space-x-6">
            <NavItem href="/">Strona główna</NavItem>
            <NavItem href="/filmy">Filmy</NavItem>
            <NavItem href="/memy">Memy</NavItem>
            <NavItem href="/quizy">Quizy</NavItem>
            <NavItem href="/kontakt">Kontakt</NavItem>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-400 text-base">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  {userData?.avatar ? (
                    <Image
                      src={userData.avatar}
                      alt={userData.username || 'Avatar użytkownika'}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-sm text-zinc-400">
                        {userData?.username?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-zinc-400 hover:text-zinc-400 text-base"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Wyloguj
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" className="bg-red-950/50 text-white border-red-800 hover:bg-red-900/50 flex items-center text-base">
                  <LogIn className="mr-2 h-4 w-4" /> Zaloguj się
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}

