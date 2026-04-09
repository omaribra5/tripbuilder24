import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import Autocomplete from '@/components/ui/Autocomplete';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

async function fetchCities(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6&featuretype=city`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data = await res.json();
  return data.filter((item) => ['city', 'town', 'village', 'municipality'].includes(item.type) || item.addresstype === 'city');
}

const MAX_DAYS = 15;

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function daysDiff(start, end) {
  return Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
}

export default function StepBasicInfo({ data, update, onNext }) {
  const { language } = useLanguage();
  const tooLong = data.start_date && data.end_date && daysDiff(data.start_date, data.end_date) > MAX_DAYS;
  const canNext = data.destination && data.start_date && data.end_date && !tooLong;

  const handleEndDate = (val) => {
    if (data.start_date && daysDiff(data.start_date, val) > MAX_DAYS) {
      update({ end_date: addDays(data.start_date, MAX_DAYS) });
    } else {
      update({ end_date: val });
    }
  };

  const handleStartDate = (val) => {
    update({ start_date: val });
    if (data.end_date && daysDiff(val, data.end_date) > MAX_DAYS) {
      update({ start_date: val, end_date: addDays(val, MAX_DAYS) });
    }
  };

  const travelers = [
    { value: 'solo', labelKey: 'traveler_solo' },
    { value: 'coppia', labelKey: 'traveler_couple' },
    { value: 'famiglia', labelKey: 'traveler_family' },
    { value: 'amici', labelKey: 'traveler_friends' },
    { value: 'gruppo', labelKey: 'traveler_group' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{t(language, 'step1_title')}</h2>
        <p className="text-muted-foreground">{t(language, 'step1_subtitle')}</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>{t(language, 'step1_city_label')}</Label>
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
              placeholder={t(language, 'step1_city_placeholder')}
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
            <Label>{t(language, 'step1_arrival')}</Label>
            <input
              type="date"
              className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={data.start_date}
              onChange={(e) => handleStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label>{t(language, 'step1_departure')}</Label>
            <input
              type="date"
              className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={data.end_date}
              onChange={(e) => handleEndDate(e.target.value)}
            />
          </div>
        </div>

        {tooLong && (
          <p className="text-sm text-red-500">{t(language, 'step1_too_long').replace('{n}', MAX_DAYS)}</p>
        )}

        <div>
          <Label>{t(language, 'step1_travelers')}</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {travelers.map(({ value, labelKey }) => (
              <button
                key={value}
                onClick={() => update({ travelers: value })}
                className={`p-2 rounded-xl border text-sm font-medium transition-all ${
                  data.travelers === value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                }`}
              >
                {t(language, labelKey)}
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
        {t(language, 'continue')}
      </Button>
    </div>
  );
}