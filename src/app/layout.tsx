import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/app/components/ui/footer"
import { NavMenu } from "@/app/components/ui/nav-menu"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body className={inter.variable}>
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
