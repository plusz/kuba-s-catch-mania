import { Link } from 'react-router-dom';

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Zbieranie danych',
    body: (
      <>
        <p>
          <strong>Gra nie zbiera, nie przechowuje ani nie przesyła żadnych danych
          osobowych.</strong> W szczególności:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>nie wymaga zakładania konta ani logowania,</li>
          <li>nie zbiera danych o lokalizacji, kontaktach, zdjęciach ani identyfikatorach urządzenia,</li>
          <li>nie zawiera reklam, analityki ani mechanizmów śledzących (trackingu),</li>
          <li>nie prowadzi zakupów w aplikacji ani mikropłatności,</li>
          <li>nie korzysta z plików cookie.</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. Dane przechowywane lokalnie',
    body: 'Gra zapisuje wyłącznie na urządzeniu użytkownika: najlepszy wynik (rekord), stan odblokowanych postaci, ustawienia dźwięku i języka oraz licznik czasu gry. Dane te nie opuszczają urządzenia i są usuwane wraz z odinstalowaniem aplikacji.',
  },
  {
    title: '3. Połączenie z internetem',
    body: 'Gra działa w pełni offline. Linki w ustawieniach (strona zwierzetadetektywi.pl, Spotify, Apple Podcasts) otwierają się w przeglądarce lub zewnętrznych aplikacjach — obowiązują tam polityki prywatności tych serwisów.',
  },
  {
    title: '4. Dzieci',
    body: 'Gra jest przeznaczona dla dzieci i rodzin (ocena wiekowa 4+). Ponieważ nie zbieramy żadnych danych, gra nie przetwarza również danych dzieci w rozumieniu COPPA, GDPR-K i podobnych regulacji.',
  },
  {
    title: '5. Game Center (opcjonalnie)',
    body: 'Jeżeli w przyszłych wersjach włączymy tabele wyników Apple Game Center, wyniki będą przetwarzane przez Apple zgodnie z polityką prywatności Apple. Zostanie to odnotowane w aktualizacji niniejszego dokumentu.',
  },
  {
    title: '6. Zmiany polityki',
    body: 'O ewentualnych zmianach poinformujemy aktualizacją tej strony.',
  },
  {
    title: '7. Kontakt',
    body: (
      <p>
        W sprawach prywatności:{' '}
        <a href="mailto:kontakt@orpi.pl" className="text-secondary hover:underline">
          kontakt@orpi.pl
        </a>
      </p>
    ),
  },
];

const Privacy = () => (
  <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
    <div className="max-w-2xl w-full bg-card border border-border rounded-xl p-6 sm:p-8">
      <h1 className="font-arcade text-lg sm:text-2xl text-secondary mb-1 text-center">
        Polityka prywatności
      </h1>
      <p className="text-xs text-muted-foreground text-center mb-6">
        aplikacji „Catch Your Dinner — Animal Detectives” · Ostatnia aktualizacja: 28 października 2026
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        Niniejsza polityka prywatności dotyczy wyłącznie aplikacji mobilnej{' '}
        <strong>Catch Your Dinner — Animal Detectives</strong> (dalej „Gra”), wydawanej
        przez <strong>ORPI.pl</strong> — twórców serii „Zwierzęta Detektywi”.
      </p>
      <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-arcade text-xs sm:text-sm text-foreground mb-2">{s.title}</h2>
            {typeof s.body === 'string' ? <p>{s.body}</p> : s.body}
          </section>
        ))}
      </div>
    </div>
    <Link
      to="/"
      className="mt-6 text-xs text-muted-foreground hover:text-secondary transition-colors"
    >
      ← Powrót do gry
    </Link>
  </div>
);

export default Privacy;
