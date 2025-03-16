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
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { ChevronDown, LogIn, LogOut, Menu, X, Home, Film, Coffee, BookOpenText, MessageSquare } from 'lucide-react'
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavItemProps extends React.ComponentPropsWithoutRef<typeof Link> {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const NavItem = ({ 
  href, 
  children, 
  className,
  ...props 
}: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link href={href} className={cn(
      "group relative",
      className
    )} {...props}>
      <Button 
        variant="ghost" 
        size="sm" 
        className={cn(
          "text-lg font-medium relative z-10 hover:bg-transparent",
          isActive 
            ? "text-white hover:text-red-400" 
            : "text-zinc-200 hover:text-white"
        )}
      >
        {children}
      </Button>
      {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
    </Link>
  );
};

export function NavMenu() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<{ username?: string, avatar?: string | null } | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClientComponentClient()
  const pathname = usePathname()

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
          <Link href="/" className="flex items-center group relative">
            <Image
              src="/movie-reel.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 invert relative z-10 transition-all duration-300"
              priority
            />
            {/* Efekt podświetlenia dla logo - tylko jasny, szybszy */}
            <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 blur-md transition-all duration-400 ease-in-out scale-90 group-hover:scale-110" />
            <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500 scale-75 group-hover:scale-125" />
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
                <Link href="/dashboard" className="group relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`text-base relative z-10 hover:bg-transparent ${
                      pathname === '/dashboard' ? 'text-white hover:text-red-400' : 'text-zinc-200 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Button>
                  {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
                </Link>
                <div className="flex items-center gap-2">
                  {userData?.avatar ? (
                    <div className="relative overflow-hidden rounded-full group">
                      <Image
                        src={userData.avatar}
                        alt={userData.username || 'Avatar użytkownika'}
                        width={32}
                        height={32}
                        className="rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute inset-0 ring-1 ring-white/10 group-hover:ring-white/40 rounded-full transition-all duration-400" />
                      <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group relative overflow-hidden">
                      <span className="text-sm text-zinc-400 group-hover:text-white transition-colors duration-300">
                        {userData?.username?.charAt(0).toUpperCase() || '?'}
                      </span>
                      <span className="absolute inset-0 ring-1 ring-white/10 group-hover:ring-white/40 rounded-full transition-all duration-400" />
                      <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400" />
                    </div>
                  )}
                </div>
                <div className="group relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-zinc-200 group-hover:text-white text-base relative z-10 hover:bg-transparent"
                    onClick={handleSignOut}
                  >
                    Wyloguj
                  </Button>
                  {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="group">
                <Button 
                  variant="outline" 
                  className={`bg-black/50 text-white border-zinc-700 flex items-center text-base transition-colors duration-300 relative overflow-hidden group hover:bg-transparent hover:border-white/30 ${
                    pathname === '/auth/login' ? 'hover:text-red-400' : 'hover:text-white'
                  }`}
                >
                  <span className="relative z-10">Zaloguj się</span>
                  {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
                </Button>
              </Link>
            )}
          </div>

          {/* Przycisk menu mobilnego */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white group relative"
            aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
          >
            <span className="relative z-10">
              {isMobileMenuOpen ? <X className="h-6 w-6 group-hover:text-white transition-colors duration-300" /> : <Menu className="h-6 w-6 group-hover:text-white transition-colors duration-300" />}
            </span>
            {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
            <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
            <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
          </button>
        </nav>

        {/* Menu mobilne */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-black/95 backdrop-blur-lg border-b border-white/10 p-4 shadow-lg md:hidden flex flex-col gap-2 z-50">
            <Link 
              href="/" 
              className={`text-lg flex items-center p-3 ${
                pathname === '/' ? 'text-white hover:text-red-400' : 'text-zinc-200 hover:text-white'
              } hover:bg-transparent relative group overflow-hidden w-full`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="relative z-10">
                Strona główna
              </span>
              {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
            </Link>
            <Link 
              href="/filmy" 
              className={`text-lg flex items-center p-3 ${
                pathname === '/filmy' ? 'text-white hover:text-red-400' : 'text-zinc-200 hover:text-white'
              } hover:bg-transparent relative group overflow-hidden w-full`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="relative z-10">
                Filmy
              </span>
              {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
            </Link>
            <Link 
              href="/memy" 
              className={`text-lg flex items-center p-3 ${
                pathname === '/memy' ? 'text-white hover:text-red-400' : 'text-zinc-200 hover:text-white'
              } hover:bg-transparent relative group overflow-hidden w-full`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="relative z-10">
                Memy
              </span>
              {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
            </Link>
            <Link 
              href="/quizy" 
              className={`text-lg flex items-center p-3 ${
                pathname === '/quizy' ? 'text-white hover:text-red-400' : 'text-zinc-200 hover:text-white'
              } hover:bg-transparent relative group overflow-hidden w-full`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="relative z-10">
                Quizy
              </span>
              {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
            </Link>
            <Link 
              href="/kontakt" 
              className={`text-lg flex items-center p-3 ${
                pathname === '/kontakt' ? 'text-white hover:text-red-400' : 'text-zinc-200 hover:text-white'
              } hover:bg-transparent relative group overflow-hidden w-full`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="relative z-10">
                Kontakt
              </span>
              {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
            </Link>
            
            <div className="mt-4 pt-4 border-t border-zinc-800/50">
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`text-lg flex items-center p-3 mb-2 ${
                      pathname === '/dashboard' ? 'text-white hover:text-red-400' : 'text-zinc-200 hover:text-white'
                    } hover:bg-transparent relative group overflow-hidden w-full`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">
                      Dashboard
                    </span>
                    {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
                    <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
                    <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-lg flex items-center p-3 text-zinc-200 hover:text-white hover:bg-transparent relative group overflow-hidden w-full"
                  >
                    <span className="relative z-10">
                      Wyloguj
                    </span>
                    {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
                    <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
                    <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/login" 
                  className={`text-lg flex items-center p-3 ${
                    pathname === '/auth/login' ? 'text-white hover:text-red-400' : 'text-zinc-200 hover:text-white'
                  } hover:bg-transparent relative group overflow-hidden w-full`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="relative z-10">
                    Zaloguj się
                  </span>
                  {/* Efekt rozświetlenia od środka - tylko jasny, szybszy */}
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 ease-in-out" />
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-white/5 via-white/30 to-white/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-90 blur-lg transition-all duration-500" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
