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
import { ChevronDown, LogIn, LogOut, Menu, X } from 'lucide-react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

          {/* Menu dla desktop */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-4 lg:space-x-6">
            <NavItem href="/">Strona główna</NavItem>
            <NavItem href="/filmy">Filmy</NavItem>
            <NavItem href="/memy">Memy</NavItem>
            <NavItem href="/quizy">Quizy</NavItem>
            <NavItem href="/kontakt">Kontakt</NavItem>
          </div>

          {/* Przycisk logowania/wylogowania dla desktop */}
          <div className="hidden md:flex items-center">
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

          {/* Przycisk menu mobilnego */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Menu mobilne */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-black/98 z-50"> 
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex flex-col p-4 space-y-4 bg-gradient-to-b from-zinc-900/80 to-black">
                <Link 
                  href="/" 
                  className="text-white hover:text-red-500 py-3 text-lg font-medium border-b border-zinc-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Strona główna
                </Link>
                <Link 
                  href="/filmy" 
                  className="text-white hover:text-red-500 py-3 text-lg font-medium border-b border-zinc-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Filmy
                </Link>
                <Link 
                  href="/memy" 
                  className="text-white hover:text-red-500 py-3 text-lg font-medium border-b border-zinc-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Memy
                </Link>
                <Link 
                  href="/quizy" 
                  className="text-white hover:text-red-500 py-3 text-lg font-medium border-b border-zinc-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Quizy
                </Link>
                <Link 
                  href="/kontakt" 
                  className="text-white hover:text-red-500 py-3 text-lg font-medium border-b border-zinc-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kontakt
                </Link>
                
                <div className="pt-2 pb-16">
                  {isLoggedIn ? (
                    <>
                      <Link 
                        href="/dashboard" 
                        className="block text-white hover:text-red-500 py-3 text-lg font-medium border-b border-zinc-800/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left text-white hover:text-red-500 py-3 text-lg font-medium flex items-center"
                      >
                        <LogOut className="h-5 w-5 mr-2" /> Wyloguj
                      </button>
                    </>
                  ) : (
                    <Link 
                      href="/auth/login" 
                      className="block text-white hover:text-red-500 py-3 text-lg font-medium flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="h-5 w-5 mr-2" /> Zaloguj się
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
