import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

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