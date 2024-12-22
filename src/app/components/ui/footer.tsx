import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo i opis */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-100">Cytaty z filmów</h3>
            <p className="text-sm text-zinc-400">
              Twoje miejsce wśród kinomaniaków! Odkrywaj, dodawaj i dziel się cytatami z ulubionych filmów.
            </p>
          </div>

          {/* Szybkie linki */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-100">Szybkie linki</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-zinc-100">
                  Strona główna
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-zinc-400 hover:text-zinc-100">
                  Filmy
                </Link>
              </li>
              <li>
                <Link href="/quizy" className="text-zinc-400 hover:text-zinc-100">
                  Quizy
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-zinc-400 hover:text-zinc-100">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Informacje prawne */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-100">Informacje</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/regulamin" className="text-zinc-400 hover:text-zinc-100">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci" className="text-zinc-400 hover:text-zinc-100">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-400 hover:text-zinc-100">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-100">Śledź nas</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-100"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-100"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-100"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-100"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-zinc-800/80">
          <p className="text-center text-sm text-zinc-400">
            © {new Date().getFullYear()} Cytaty z filmów. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  )
} 