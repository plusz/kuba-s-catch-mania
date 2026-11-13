import { Link } from 'react-router-dom';
import appStoreBadge from '@/assets/app-store-badge-pl.svg';

/** Site footer — store links + legal */
const Footer = () => (
  <footer className="mt-12 flex flex-col items-center gap-4 text-center">
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href="https://apps.apple.com/us/app/catch-your-dinner/id6827302833"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={appStoreBadge}
          alt="Pobierz w App Store"
          className="h-10 transition-opacity hover:opacity-80"
        />
      </a>
      <span className="inline-flex items-center rounded-lg bg-muted border border-border px-4 py-2 text-xs text-muted-foreground">
        Android — wkrótce
      </span>
    </div>
    <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <Link to="/polityka-prywatnosci" className="hover:text-secondary transition-colors">
        Polityka prywatności
      </Link>
      <span aria-hidden="true">·</span>
      <Link to="/regulamin" className="hover:text-secondary transition-colors">
        Regulamin
      </Link>
      <span aria-hidden="true">·</span>
      <span>© 2026 Zwierzęta Detektywi</span>
    </nav>
  </footer>
);

export default Footer;
