import { Link } from 'react-router-dom';
import appStoreBadge from '@/assets/app-store-badge-pl.svg';
import { useLang, type Lang } from '@/lib/i18n';

/** Site footer — store links + legal + language switch */
const Footer = () => {
  const { lang, setLang, t } = useLang();

  const langButton = (l: Lang, label: string) => (
    <button
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={`transition-colors ${
        lang === l
          ? 'font-bold text-foreground'
          : 'text-muted-foreground/60 hover:text-muted-foreground'
      }`}
    >
      {label}
    </button>
  );

  return (
    <footer className="mt-12 flex flex-col items-center gap-4 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="https://apps.apple.com/us/app/catch-your-dinner/id6827302833"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={appStoreBadge}
            alt={t('appStoreAlt')}
            className="h-10 transition-opacity hover:opacity-80"
          />
        </a>
        <span className="inline-flex items-center rounded-lg bg-muted border border-border px-4 py-2 text-xs text-muted-foreground">
          {t('androidSoon')}
        </span>
      </div>
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <Link to="/polityka-prywatnosci" className="hover:text-secondary transition-colors">
          {t('privacy')}
        </Link>
        <span aria-hidden="true">·</span>
        <Link to="/regulamin" className="hover:text-secondary transition-colors">
          {t('terms')}
        </Link>
        <span aria-hidden="true">·</span>
        <span>© 2026 Zwierzęta Detektywi</span>
        <span aria-hidden="true">·</span>
        <span className="opacity-60" title="wersja buildu">v {__BUILD_ID__}</span>
        <span aria-hidden="true">·</span>
        <span aria-label={t('langLabel')} className="inline-flex items-center gap-1">
          {langButton('pl', 'PL')}
          <span aria-hidden="true" className="text-muted-foreground/60">/</span>
          {langButton('en', 'EN')}
        </span>
      </nav>
    </footer>
  );
};

export default Footer;
