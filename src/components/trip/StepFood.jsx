import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const INTOLERANCES = [
  { value: 'glutine', label: '🌾 Glutine' },
  { value: 'lattosio', label: '🥛 Lattosio' },
  { value: 'frutta secca', label: '🥜 Frutta secca' },
  { value: 'uova', label: '🥚 Uova' },
  { value: 'pesce', label: '🐟 Pesce' },
  { value: 'crostacei', label: '🦐 Crostacei' },
  { value: 'soia', label: '🫘 Soia' },
  { value: 'vegano', label: '🌱 Vegano' },
  { value: 'vegetariano', label: '🥦 Vegetariano' },
];

const MEAL_TIMES = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];

export default function StepFood({ data, update, onNext }) {
  const toggleIntolerance = (val) => {
    const current = data.food_intolerances || [];
    if (current.includes(val)) {
      update({ food_intolerances: current.filter((i) => i !== val) });
    } else {
      update({ food_intolerances: [...current, val] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Le tue preferenze alimentari</h2>
        <p className="text-muted-foreground">L'AI troverà i ristoranti perfetti per te lungo il percorso</p>
      </div>

      <div>
        <Label className="mb-2 block">Intolleranze / diete speciali</Label>
        <div className="grid grid-cols-3 gap-2">
          {INTOLERANCES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleIntolerance(value)}
              className={`p-2 rounded-xl border text-sm font-medium transition-all ${
                (data.food_intolerances || []).includes(value)
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Cibi preferiti</Label>
        <Input
          className="mt-1"
          placeholder="es. pasta, sushi, tapas, carne alla griglia..."
          value={data.favorite_foods}
          onChange={(e) => update({ favorite_foods: e.target.value })}
        />
      </div>

      <div>
        <Label>Cibi che non ti piacciono</Label>
        <Input
          className="mt-1"
          placeholder="es. trippa, pesce crudo, piccante..."
          value={data.disliked_foods}
          onChange={(e) => update({ disliked_foods: e.target.value })}
        />
      </div>

      <div>
        <Label className="mb-2 block">Orario pranzo preferito</Label>
        <div className="grid grid-cols-3 gap-2">
          {MEAL_TIMES.map((time) => (
            <button
              key={time}
              onClick={() => update({ meal_time_preference: time })}
              className={`p-2 rounded-xl border text-sm font-medium transition-all ${
                data.meal_time_preference === time
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={onNext}>
        Continua
      </Button>
    </div>
  );
}