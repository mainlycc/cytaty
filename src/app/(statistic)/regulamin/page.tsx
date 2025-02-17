export default function RegulaminPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-zinc-50 mb-8 text-center">
          Regulamin Serwisu
        </h1>
        
        <div className="space-y-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
          <section className="rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-4">
              §1. Postanowienia ogólne
            </h2>
            <div className="space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p>1.1. Niniejszy regulamin określa zasady korzystania z serwisu internetowego służącego do udostępniania i przeglądania memów.</p>
              <p>1.2. Korzystanie z serwisu jest dobrowolne i bezpłatne.</p>
            </div>
          </section>

          <section className="rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-4">
              §2. Zasady publikowania memów
            </h2>
            <div className="space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p>2.1. Użytkownik może publikować memy własnego autorstwa lub memy, do których posiada prawa.</p>
              <p>2.2. Zabronione jest publikowanie treści:</p>
              <ul className="list-disc ml-6 space-y-2 mt-2">
                <li>naruszających prawa autorskie</li>
                <li>zawierających treści obraźliwe lub wulgarne</li>
                <li>nawołujących do nienawiści</li>
                <li>zawierających treści niezgodne z prawem</li>
              </ul>
            </div>
          </section>

          <section className="rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-4">
              §3. Moderacja
            </h2>
            <div className="space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p>3.1. Wszystkie publikowane memy podlegają moderacji.</p>
              <p>3.2. Administratorzy mają prawo do usuwania treści naruszających regulamin.</p>
            </div>
          </section>

          <section className="rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-4">
              §4. Postanowienia końcowe
            </h2>
            <div className="space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p>4.1. Administracja zastrzega sobie prawo do zmiany regulaminu.</p>
              <p>4.2. O wszelkich zmianach użytkownicy będą informowani poprzez stronę główną serwisu.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}