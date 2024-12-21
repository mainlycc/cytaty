"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, UserIcon } from 'lucide-react'

const NavItem = ({ href, children, items }: { href: string; children: React.ReactNode; items?: { title: string; href: string }[] }) => {
  if (items) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-full px-4 py-2 text-white hover:text-red-500 transition-colors">
            {children} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 rounded-md">
          {items.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="block px-4 py-2 text-sm text-white hover:bg-red-500/20">
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button variant="ghost" asChild className="h-full px-4 py-2 text-white hover:text-red-500 transition-colors">
      <Link href={href}>{children}</Link>
    </Button>
  )
}

export function NavMenu() {
  return (
    <div className="bg-black/50 backdrop-blur-sm fixed w-full z-10">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-xl">
            Cytaty z filmów
          </Link>
          <div className="flex items-center space-x-4 lg:space-x-6">
            <NavItem href="/">Strona główna</NavItem>
            <NavItem href="/movies">Filmy</NavItem>
            <NavItem
              href="/memy"
              items={[
                { title: "Generator memów", href: "/generator-memow" },
                { title: "Ściana z memami", href: "/sciana-z-memami" },
              ]}
            >
              Memy
            </NavItem>
            <NavItem href="/quizy">Quizy</NavItem>
            <NavItem href="/kontakt">Kontakt</NavItem>
          </div>
          <Link href="/auth/login">
            <Button variant="outline" className="bg-red-950/50 text-white border-red-800 hover:bg-red-900/50 flex items-center">
              <UserIcon className="mr-2 h-4 w-4" /> Zaloguj się
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  )
}

