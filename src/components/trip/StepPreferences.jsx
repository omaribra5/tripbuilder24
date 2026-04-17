import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';
import { Turtle, Zap } from 'lucide-react';

const INTERESTS = [
  { value: 'arte', labelKey: 'interest_art' },
  { value: 'storia', labelKey: 'interest_history' },
  { value: 'natura', labelKey: 'interest_nature' },
  { value: 'cibo', labelKey: 'interest_food' },
  { value: 'shopping', labelKey: 'interest_shopping' },
  { value: 'nightlife', labelKey: 'interest_nightlife' },
  { value: 'sport', labelKey: 'interest_sport' },
  { value: 'relax', labelKey: 'interest_relax' },
  { value: 'avventura', labelKey: 'interest_adventure' },
  { value: 'fotografia', labelKey: 'interest_photography' },
  { value: 'musica', labelKey: 'interest_music' },
  { value: 'architettura', labelKey: 'interest_architecture' },
];

const BUDGETS = [
  { value: 'economico', labelKey: 'budget_low', descKey: 'budget_low_desc' },
  { value: 'medio', labelKey: 'budget_mid', descKey: 'budget_mid_desc' },
  { value: 'lusso', labelKey: 'budget_high', descKey: 'budget_high_desc' },
];

export default function StepPreferences({ data, update, onNext }) {
  const { language } = useLanguage();

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
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{t(language, 'step2_title')}</h2>
        <p className="text-muted-foreground">{t(language, 'step2_subtitle')}</p>
      </div>

      <div>
        <Label className="mb-2 block">{t(language, 'step2_interests')}</Label>
        <div className="grid grid-cols-3 gap-2">
          {INTERESTS.map(({ value, labelKey }) => (
            <button
              key={value}
              onClick={() => toggleInterest(value)}
              className={`p-2 rounded-xl border text-sm font-medium transition-all text-left ${
                (data.interests || []).includes(value)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {t(language, labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">{t(language, 'step2_budget')}</Label>
        <div className="space-y-2">
          {BUDGETS.map(({ value, labelKey, descKey }) => (
            <button
              key={value}
              onClick={() => update({ budget: value })}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                data.budget === value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="font-semibold">{t(language, labelKey)}</div>
              <div className={`text-sm ${data.budget === value ? 'text-indigo-100' : 'text-muted-foreground'}`}>{t(language, descKey)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Trip intensity slider */}
      <div>
        <Label className="mb-3 block">{t(language, 'step2_intensity') || 'Intensità del viaggio'}</Label>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={data.trip_intensity ?? 3}
            onChange={(e) => update({ trip_intensity: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Turtle className="w-4 h-4 text-emerald-500" />
              <span>Rilassato<br/><span className="text-[10px] text-gray-400">Poche cose, tanto tempo libero</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 text-right">
              <span className="text-right">Intenso<br/><span className="text-[10px] text-gray-400">Tante attività, giornate piene</span></span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          {/* Visual indicator */}
          <div className="flex justify-center">
            {[1,2,3,4,5].map((v) => (
              <div
                key={v}
                className={`w-8 h-1.5 mx-0.5 rounded-full transition-all ${
                  v <= (data.trip_intensity ?? 3) ? 'bg-indigo-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-xs font-medium text-indigo-600">
            {[
              'Molto rilassato — massimo 2-3 attrazioni al giorno',
              'Rilassato — 3-4 attrazioni, tanti momenti di pausa',
              'Bilanciato — 4-5 attrazioni al giorno',
              'Attivo — 5-6 attrazioni, poche pause',
              'Intensissimo — fino a 7-8 attrazioni, ogni minuto è pieno',
            ][(data.trip_intensity ?? 3) - 1]}
          </p>
        </div>
      </div>

      <div>
        <Label>{t(language, 'step2_notes')}</Label>
        <Textarea
          className="mt-1"
          placeholder={t(language, 'step2_notes_placeholder')}
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={onNext}>
        {t(language, 'continue')}
      </Button>
    </div>
  );
}