export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-zinc-50 mb-8 text-center">
          Polityka Prywatności
        </h1>
        
        <div className="space-y-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
          <section className="rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-4">
              1. Informacje ogólne
            </h2>
            <div className="space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p>Niniejsza polityka dotyczy Serwisu funkcjonującego pod adresem URL: twoja-domena.pl</p>
              <p>Operatorem serwisu oraz Administratorem danych osobowych jest: Twoja Firma</p>
            </div>
          </section>

          <section className="rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-4">
              2. Rodzaj przetwarzanych danych
            </h2>
            <div className="space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p>Serwis zbiera następujące dane:</p>
              <ul className="list-disc ml-6 space-y-2 mt-2">
                <li>Adres e-mail</li>
                <li>Nazwa użytkownika</li>
                <li>Opcjonalnie avatar użytkownika</li>
                <li>Dane o aktywności w serwisie (polubienia, komentarze)</li>
              </ul>
            </div>
          </section>

          <section className="rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-4">
              3. Cel przetwarzania danych
            </h2>
            <div className="space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p>Dane są przetwarzane w celu:</p>
              <ul className="list-disc ml-6 space-y-2 mt-2">
                <li>Świadczenia usług związanych z prowadzeniem serwisu</li>
                <li>Weryfikacji tożsamości użytkowników</li>
                <li>Umożliwienia interakcji między użytkownikami</li>
              </ul>
            </div>
          </section>

          <section className="rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-4">
              4. Prawa użytkownika
            </h2>
            <div className="space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p>Użytkownik ma prawo do:</p>
              <ul className="list-disc ml-6 space-y-2 mt-2">
                <li>Dostępu do swoich danych</li>
                <li>Sprostowania danych</li>
                <li>Usunięcia danych</li>
                <li>Ograniczenia przetwarzania</li>
                <li>Przenoszenia danych</li>
              </ul>
            </div>
          </section>

          <section className="rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-4">
              5. Kontakt
            </h2>
            <div className="space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p>W sprawach związanych z ochroną danych osobowych można kontaktować się pod adresem email: kontakt@twoja-domena.pl</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}