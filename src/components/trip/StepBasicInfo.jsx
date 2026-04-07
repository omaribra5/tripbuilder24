import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import Autocomplete from '@/components/ui/Autocomplete';

async function fetchCities(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6&featuretype=city`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'it' } });
  const data = await res.json();
  return data.filter((item) => ['city', 'town', 'village', 'municipality'].includes(item.type) || item.addresstype === 'city');
}

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
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
            <Autocomplete
              value={data.destination}
              onChange={(val) => update({ destination: val })}
              onSelect={(item) => {
                const city = item.address?.city || item.address?.town || item.address?.village || item.name;
                const country = item.address?.country || '';
                update({ destination: city, country });
              }}
              placeholder="es. Barcellona, Parigi, Tokyo..."
              fetchSuggestions={fetchCities}
              renderItem={(item) => ({
                label: item.address?.city || item.address?.town || item.address?.village || item.name,
                sublabel: [item.address?.state, item.address?.country].filter(Boolean).join(', '),
              })}
              className="[&_input]:pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Data arrivo *</Label>
            <input
              type="date"
              className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={data.start_date}
              onChange={(e) => update({ start_date: e.target.value })}
            />
          </div>
          <div>
            <Label>Data partenza *</Label>
            <input
              type="date"
              className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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