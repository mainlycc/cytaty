interface QuoteCardProps {
    quote: string
    movie: string
    year: string
  }
  
  export function QuoteCard({ quote, movie, year }: QuoteCardProps) {
    return (
      <div className="bg-black/50 backdrop-blur-sm border border-zinc-800 p-6 rounded-lg">
        <blockquote className="text-lg text-zinc-100 mb-4">&ldquo;{quote}&rdquo;</blockquote>
        <footer className="text-sm text-zinc-400">
          <p>{movie}</p>
          <p>{year}</p>
        </footer>
      </div>
    )
  }
  