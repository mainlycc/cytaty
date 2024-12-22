import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/app/components/ui/footer"

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
      <body>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
