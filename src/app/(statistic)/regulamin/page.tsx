export default function RegulaminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-zinc-100 mb-4">Regulamin</h1>
      
      <div className="space-y-4 text-sm">
        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">§1. Postanowienia ogólne</h2>
          <div className="space-y-2 text-zinc-300 text-xs">
            <p>1.1. Niniejszy regulamin określa zasady korzystania z serwisu internetowego służącego do udostępniania i przeglądania memów.</p>
            <p>1.2. Korzystanie z serwisu jest dobrowolne i bezpłatne.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">§2. Zasady publikowania memów</h2>
          <div className="space-y-2 text-zinc-300 text-xs">
            <p>2.1. Użytkownik może publikować memy własnego autorstwa lub memy, do których posiada prawa.</p>
            <p>2.2. Zabronione jest publikowanie treści:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>naruszających prawa autorskie</li>
              <li>zawierających treści obraźliwe lub wulgarne</li>
              <li>nawołujących do nienawiści</li>
              <li>zawierających treści niezgodne z prawem</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">§3. Moderacja</h2>
          <div className="space-y-2 text-zinc-300 text-xs">
            <p>3.1. Wszystkie publikowane memy podlegają moderacji.</p>
            <p>3.2. Administratorzy mają prawo do usuwania treści naruszających regulamin.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">§4. Postanowienia końcowe</h2>
          <div className="space-y-2 text-zinc-300 text-xs">
            <p>4.1. Administracja zastrzega sobie prawo do zmiany regulaminu.</p>
            <p>4.2. O wszelkich zmianach użytkownicy będą informowani poprzez stronę główną serwisu.</p>
          </div>
        </section>
      </div>
    </div>
  )
}