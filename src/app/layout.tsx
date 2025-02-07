import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/app/components/ui/footer"
import { NavMenu } from "@/app/components/ui/nav-menu"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cytaty",
  description: "Cytaty z filmów",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NavMenu />
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-900 to-black">
          <div className="flex-grow pt-16 md:pt-16">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
