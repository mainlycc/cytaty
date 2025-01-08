export default function StaticLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-950">
        <main className="container mx-auto px-4 py-16">
          {children}
        </main>
      </div>
    )
  }