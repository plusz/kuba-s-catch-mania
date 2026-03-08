import { playClickSound } from '@/lib/audio';

const PlayTimeWarning = ({
  onContinue,
  onMenu,
}: {
  onContinue: () => void;
  onMenu: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
    <div className="bg-card border-2 border-secondary rounded-2xl p-8 max-w-md mx-4">
      <h2 className="font-arcade text-lg text-secondary mb-4">⏰ Czas na przerwę!</h2>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Grasz już 15 minut. Pamiętaj, że zbyt długie siedzenie przed ekranem źle wpływa na
        Twój wzrok i zdrowie. Wyjdź na świeże powietrze, poruszaj się, a może sięgnij po
        dobrą książkę! 📚🌳
      </p>
      <p className="text-xs text-muted-foreground mb-8">
        Możesz jeszcze pograć, ale za 15 minut gra zostanie zablokowana na godzinę.
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => { playClickSound(); onContinue(); }}
          className="font-arcade text-xs px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Gram dalej
        </button>
        <button
          onClick={() => { playClickSound(); onMenu(); }}
          className="font-arcade text-xs px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
        >
          Kończę grać 👍
        </button>
      </div>
    </div>
  </div>
);

export default PlayTimeWarning;
