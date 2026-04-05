import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

export default function StepBasicInfo({ data, update, onNext }) {
  const canNext = data.destination && data.start_date && data.end_date;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dove vuoi andare?</h2>
        <p className="text-muted-foreground">Inserisci la tua destinazione e le date</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Città / Destinazione *</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="es. Barcellona, Parigi, Tokyo..."
              value={data.destination}
              onChange={(e) => update({ destination: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Paese</Label>
          <Input
            className="mt-1"
            placeholder="es. Spagna, Francia, Giappone..."
            value={data.country}
            onChange={(e) => update({ country: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Data arrivo *</Label>
            <Input
              type="date"
              className="mt-1"
              value={data.start_date}
              onChange={(e) => update({ start_date: e.target.value })}
            />
          </div>
          <div>
            <Label>Data partenza *</Label>
            <Input
              type="date"
              className="mt-1"
              value={data.end_date}
              onChange={(e) => update({ end_date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Con chi viaggi?</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { value: 'solo', label: '🧳 Solo' },
              { value: 'coppia', label: '💑 Coppia' },
              { value: 'famiglia', label: '👨‍👩‍👧 Famiglia' },
              { value: 'amici', label: '👫 Amici' },
              { value: 'gruppo', label: '👥 Gruppo' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => update({ travelers: value })}
                className={`p-2 rounded-xl border text-sm font-medium transition-all ${
                  data.travelers === value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        disabled={!canNext}
        onClick={onNext}
      >
        Continua
      </Button>
    </div>
  );
}