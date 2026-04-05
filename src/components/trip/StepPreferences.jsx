import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const INTERESTS = [
  { value: 'arte', label: '🎨 Arte' },
  { value: 'storia', label: '🏛️ Storia' },
  { value: 'natura', label: '🌿 Natura' },
  { value: 'cibo', label: '🍝 Gastronomia' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'nightlife', label: '🎉 Vita notturna' },
  { value: 'sport', label: '⛷️ Sport' },
  { value: 'relax', label: '🧘 Relax' },
  { value: 'avventura', label: '🧗 Avventura' },
  { value: 'fotografia', label: '📷 Fotografia' },
  { value: 'musica', label: '🎵 Musica' },
  { value: 'architettura', label: '🏰 Architettura' },
];

const BUDGETS = [
  { value: 'economico', label: '💰 Economico', desc: 'Ostelli, street food, trasporti locali' },
  { value: 'medio', label: '💳 Medio', desc: 'Hotel 3★, ristoranti locali' },
  { value: 'lusso', label: '💎 Lusso', desc: 'Hotel 5★, ristoranti gourmet' },
];

export default function StepPreferences({ data, update, onNext }) {
  const toggleInterest = (val) => {
    const current = data.interests || [];
    if (current.includes(val)) {
      update({ interests: current.filter((i) => i !== val) });
    } else {
      update({ interests: [...current, val] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Cosa ti piace fare?</h2>
        <p className="text-muted-foreground">Seleziona i tuoi interessi e il budget</p>
      </div>

      <div>
        <Label className="mb-2 block">Interessi (seleziona più opzioni)</Label>
        <div className="grid grid-cols-3 gap-2">
          {INTERESTS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleInterest(value)}
              className={`p-2 rounded-xl border text-sm font-medium transition-all text-left ${
                (data.interests || []).includes(value)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Budget</Label>
        <div className="space-y-2">
          {BUDGETS.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => update({ budget: value })}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                data.budget === value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="font-semibold">{label}</div>
              <div className={`text-sm ${data.budget === value ? 'text-indigo-100' : 'text-muted-foreground'}`}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Note aggiuntive</Label>
        <Textarea
          className="mt-1"
          placeholder="Es: ho bambini piccoli, mi piace camminare molto, preferisco evitare posti affollati..."
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={onNext}>
        Continua
      </Button>
    </div>
  );
}