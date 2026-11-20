import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';

const sections: { title: string; body: string }[] = [
  {
    title: '1. Postanowienia ogólne',
    body: 'Niniejszy regulamin określa zasady korzystania z gry „Catch Your Dinner — Zwierzęta Detektywi”, dostępnej pod adresem stekikuby.orpi.pl oraz w aplikacjach mobilnych na systemy iOS i Android (dalej: „Gra”). Wydawcą Gry jest serwis www.ZwierzetaDetektywi.pl.',
  },
  {
    title: '2. Zasady korzystania',
    body: 'Gra jest bezpłatna i nie wymaga rejestracji ani zakładania konta. Jest przeznaczona dla dzieci — z korzystania przez dzieci powinni czuwać rodzice lub opiekunowie. Gra zawiera wbudowane limity czasu gry (przypomnienie po 15 minutach i przerwa po 30 minutach), których nie należy omijać.',
  },
  {
    title: '3. Własność intelektualna',
    body: 'Wszystkie elementy Gry — w tym grafiki, postacie (Lew Kuba, Mysz Patrycja, Mrówkojad Alfred, Żyrafa Zofia, Szakal Szymon), animacje, dźwięki i kod — stanowią własność wydawcy lub są używane za jego zgodą. Kopiowanie, modyfikowanie i wykorzystywanie tych elementów w celach komercyjnych bez pisemnej zgody wydawcy jest zabronione.',
  },
  {
    title: '4. Dane osobowe',
    body: 'Gra nie zbiera danych osobowych użytkowników. Wyniki i ustawienia zapisywane są wyłącznie lokalnie na urządzeniu. Szczegóły opisuje Polityka prywatności, dostępna pod adresem stekikuby.orpi.pl/polityka-prywatnosci.',
  },
  {
    title: '5. Odpowiedzialność',
    body: 'Gra udostępniana jest w stanie „takim, jakim jest” (as is). Wydawca dokłada starań, aby działała poprawnie, lecz nie gwarantuje nieprzerwanej dostępności ani braku błędów. W granicach dozwolonych przez prawo wydawca nie ponosi odpowiedzialności za szkody wynikłe z korzystania z Gry.',
  },
  {
    title: '6. Zmiany regulaminu',
    body: 'Wydawca może zmienić niniejszy regulamin w każdym czasie. Aktualna wersja jest zawsze dostępna na tej stronie. Dalsze korzystanie z Gry po publikacji zmian oznacza ich akceptację.',
  },
  {
    title: '7. Postanowienia końcowe',
    body: 'Regulamin podlega prawu polskiemu. Kontakt z wydawcą możliwy jest poprzez stronę www.ZwierzetaDetektywi.pl. Regulamin obowiązuje od 13 listopada 2026 r.',
  },
];

const Terms = () => {
  const { t } = useLang();
  return (
  <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
    <div className="max-w-2xl w-full bg-card border border-border rounded-xl p-6 sm:p-8">
      <h1 className="font-arcade text-lg sm:text-2xl text-secondary mb-6 text-center">
        Regulamin gry
      </h1>
      <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-arcade text-xs sm:text-sm text-foreground mb-2">{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </div>
    <Link
      to="/"
      className="mt-6 text-xs text-muted-foreground hover:text-secondary transition-colors"
    >
      {t('backToGame')}
    </Link>
  </div>
  );
};

export default Terms;
