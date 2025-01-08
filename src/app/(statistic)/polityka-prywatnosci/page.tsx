export default function PolitykaPrywatnosciPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-zinc-100 mb-4">Polityka Prywatności</h1>
      
      <div className="space-y-4 text-sm">
        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">1. Informacje ogólne</h2>
          <div className="space-y-2 text-zinc-300 text-xs">
            <p>Niniejsza polityka dotyczy Serwisu funkcjonującego pod adresem URL: twoja-domena.pl</p>
            <p>Operatorem serwisu oraz Administratorem danych osobowych jest: Twoja Firma</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">2. Rodzaj przetwarzanych danych</h2>
          <div className="space-y-2 text-zinc-300 text-xs">
            <p>Serwis zbiera następujące dane:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Adres e-mail</li>
              <li>Nazwa użytkownika</li>
              <li>Opcjonalnie avatar użytkownika</li>
              <li>Dane o aktywności w serwisie (polubienia, komentarze)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">3. Cel przetwarzania danych</h2>
          <div className="space-y-2 text-zinc-300 text-xs">
            <p>Dane są przetwarzane w celu:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Świadczenia usług związanych z prowadzeniem serwisu</li>
              <li>Weryfikacji tożsamości użytkowników</li>
              <li>Umożliwienia interakcji między użytkownikami</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">4. Prawa użytkownika</h2>
          <div className="space-y-2 text-zinc-300 text-xs">
            <p>Użytkownik ma prawo do:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Dostępu do swoich danych</li>
              <li>Sprostowania danych</li>
              <li>Usunięcia danych</li>
              <li>Ograniczenia przetwarzania</li>
              <li>Przenoszenia danych</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">5. Kontakt</h2>
          <div className="text-zinc-300 text-xs">
            <p>W sprawach związanych z ochroną danych osobowych można kontaktować się pod adresem email: kontakt@twoja-domena.pl</p>
          </div>
        </section>
      </div>
    </div>
  )
}