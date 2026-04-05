import { Loader2, MapPin, UtensilsCrossed, Hotel, Plane } from 'lucide-react';

const steps = [
  { icon: MapPin, label: 'Analisi della destinazione...' },
  { icon: UtensilsCrossed, label: 'Ricerca ristoranti in base ai tuoi gusti...' },
  { icon: Hotel, label: 'Selezione hotel per posizione e budget...' },
  { icon: Plane, label: 'Calcolo trasferimenti aeroporto...' },
];

export default function StepGenerating() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 flex items-center justify-center text-white px-6">
      <div className="text-center max-w-md">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-300 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-2">L'AI sta creando il tuo viaggio...</h2>
        <p className="text-blue-200 mb-10">Ci vorrà qualche secondo</p>
        <div className="space-y-3">
          {steps.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-left">
              <Icon className="w-5 h-5 text-yellow-300 shrink-0" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}