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
import { ChevronDown, UserIcon, LogIn, LogOut } from 'lucide-react'

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
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkAuth()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signout')
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm fixed w-full z-10">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-xl">
            Cytaty z filmów
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
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 text-base">
                    Dashboard
                  </Button>
                </Link>
                <span className="text-sm text-zinc-400">Zalogowano</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-zinc-400 hover:text-zinc-100 text-base"
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

