import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { GameCharacter } from './gameTypes';

export type Lang = 'pl' | 'en';

const STORAGE_KEY = 'catch-game-lang';
const DEFAULT_LANG: Lang = 'pl';

type Vars = Record<string, string | number>;

/** UI strings — PL from the Android app (res/values-pl), EN from res/values. */
const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    chooseChar: 'Choose your character',
    catches: 'Catches {obj}',
    lockedLabel: 'Locked',
    secretTitle: 'Secret Characters',
    secretHint: "💡 Hint: name the rooster from the story 'The Sticky Rain Mystery'",
    answerPlaceholder: 'Enter answer...',
    wrongAnswer: 'Wrong answer. Try again.',
    cancel: 'Cancel',
    unlock: 'Unlock',
    catchThe: 'Catch the {obj}!',
    controls: 'Controls',
    dirTopLeft: '↖ Top Left',
    dirTopRight: '↗ Top Right',
    dirBottomLeft: '↙ Bottom Left',
    dirBottomRight: '↘ Bottom Right',
    missHint: "Miss one {obj} and it's game over!",
    back: '← Back',
    startGame: 'Start Game',
    score: 'Score',
    level: 'Level',
    muteMusic: 'Mute music',
    unmuteMusic: 'Unmute music',
    gameOver: 'Game Over!',
    bestScore: 'Best Score',
    newRecord: '🏆 New Record!',
    playAgain: 'Play Again',
    mainMenu: 'Main Menu',
    breakTitle: '⏰ Time for a break!',
    breakBody:
      "You've been playing for 15 minutes. Sitting in front of a screen too long is bad for your eyes and health — go outside, move around, or grab a good book! 📚🌳",
    breakSub: 'You can keep playing, but in 15 minutes the game will be locked for an hour.',
    keepPlaying: 'Keep playing',
    donePlaying: "I'm done 👍",
    lockTitle: '🔒 Break time!',
    lockBody:
      "You've been playing for over 30 minutes — time for a real break! Go outside, run around, read a book or play with your friends. 🌞",
    lockBack: 'The game will be back in about',
    privacy: 'Privacy Policy',
    terms: 'Terms',
    androidSoon: 'Android — coming soon',
    backToGame: '← Back to game',
    pageNotFound: 'Oops! Page not found',
    returnHome: 'Return to Home',
    appStoreAlt: 'Download on the App Store',
    langLabel: 'Language',
  },
  pl: {
    chooseChar: 'Wybierz postać',
    catches: 'Łapie {obj}',
    lockedLabel: 'Zablokowana',
    secretTitle: 'Sekretne postacie',
    secretHint: '💡 Podaj imię koguta z bajki „Zagadka Lepkiego Deszczu”.',
    answerPlaceholder: 'Wpisz odpowiedź…',
    wrongAnswer: 'Zła odpowiedź. Spróbuj jeszcze raz.',
    cancel: 'Anuluj',
    unlock: 'Odblokuj',
    catchThe: 'Łap {obj}!',
    controls: 'Sterowanie',
    dirTopLeft: '↖ Lewy górny',
    dirTopRight: '↗ Prawy górny',
    dirBottomLeft: '↙ Lewy dolny',
    dirBottomRight: '↘ Prawy dolny',
    missHint: 'Chybisz {obj} i koniec gry!',
    back: '← Wstecz',
    startGame: 'Start',
    score: 'Wynik',
    level: 'Poziom',
    muteMusic: 'Wycisz muzykę',
    unmuteMusic: 'Włącz muzykę',
    gameOver: 'Koniec gry!',
    bestScore: 'Rekord',
    newRecord: '🏆 Nowy rekord!',
    playAgain: 'Zagraj ponownie',
    mainMenu: 'Menu główne',
    breakTitle: '⏰ Czas na przerwę!',
    breakBody:
      'Grasz już 15 minut. Pamiętaj, że zbyt długie siedzenie przed ekranem źle wpływa na Twój wzrok i zdrowie. Wyjdź na świeże powietrze, poruszaj się, a może sięgnij po dobrą książkę! 📚🌳',
    breakSub: 'Możesz jeszcze pograć, ale za 15 minut gra zostanie zablokowana na godzinę.',
    keepPlaying: 'Gram dalej',
    donePlaying: 'Kończę grać 👍',
    lockTitle: '🔒 Przerwa!',
    lockBody:
      'Grasz już ponad 30 minut — pora na prawdziwą przerwę! Wyjdź na zewnątrz, pobiegaj, poczytaj książkę albo pobaw się z przyjaciółmi. 🌞',
    lockBack: 'Gra będzie dostępna ponownie za ok.',
    privacy: 'Polityka prywatności',
    terms: 'Regulamin',
    androidSoon: 'Android — wkrótce',
    backToGame: '← Powrót do gry',
    pageNotFound: 'Ups! Nie znaleziono strony',
    returnHome: 'Wróć na stronę główną',
    appStoreAlt: 'Pobierz w App Store',
    langLabel: 'Język',
  },
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Vars) => string;
}

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' || saved === 'pl' ? saved : DEFAULT_LANG;
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangCtx>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => {
        let s = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            s = s.replaceAll(`{${k}}`, String(v));
          }
        }
        return s;
      },
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang used outside LangProvider');
  return ctx;
}

/** Localized display labels for characters and their catchable objects. */
export function useLabels() {
  const { lang } = useLang();
  return {
    charName: (c: GameCharacter) =>
      lang === 'pl' ? c.displayNamePl ?? c.displayName : c.displayName,
    objName: (c: GameCharacter) =>
      lang === 'pl' ? c.objectNamePl ?? c.objectName : c.objectName,
  };
}
