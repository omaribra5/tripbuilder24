import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';
import { Utensils, Clock } from 'lucide-react';

const INTOLERANCES = [
  { value: 'glutine', labelKey: 'intolerance_gluten' },
  { value: 'lattosio', labelKey: 'intolerance_lactose' },
  { value: 'frutta secca', labelKey: 'intolerance_nuts' },
  { value: 'uova', labelKey: 'intolerance_eggs' },
  { value: 'pesce', labelKey: 'intolerance_fish' },
  { value: 'crostacei', labelKey: 'intolerance_shellfish' },
  { value: 'soia', labelKey: 'intolerance_soy' },
  { value: 'vegano', labelKey: 'intolerance_vegan' },
  { value: 'vegetariano', labelKey: 'intolerance_vegetarian' },
];

const LUNCH_TIMES = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];
const DINNER_TIMES = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

export default function StepFood({ data, update, onNext }) {
  const { language } = useLanguage();

  const toggleIntolerance = (val) => {
    const current = data.food_intolerances || [];
    if (current.includes(val)) {
      update({ food_intolerances: current.filter((i) => i !== val) });
    } else {
      update({ food_intolerances: [...current, val] });
    }
  };

  const wantsRestaurants = data.wants_restaurants;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{t(language, 'step3_title')}</h2>
        <p className="text-muted-foreground">{t(language, 'step3_subtitle')}</p>
      </div>

      {/* Ask about restaurants */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Vuoi che aggiunga io i ristoranti nel tour?</Label>
        <p className="text-sm text-muted-foreground">Se dici no, lascerò un buco di ~2 ore per i pasti così puoi scegliere tu dove mangiare.</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => update({ wants_restaurants: true })}
            className={`flex items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
              wantsRestaurants === true
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Sì, aggiungi i ristoranti
          </button>
          <button
            onClick={() => update({ wants_restaurants: false })}
            className={`flex items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
              wantsRestaurants === false
                ? 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-gray-700 border-gray-200 hover:border-slate-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            No, lascio il tempo libero
          </button>
        </div>
      </div>

      {/* Restaurant details — shown only if wants_restaurants === true */}
      {wantsRestaurants === true && (
        <>
          <div>
            <Label className="mb-2 block">{t(language, 'step3_intolerances')}</Label>
            <div className="grid grid-cols-3 gap-2">
              {INTOLERANCES.map(({ value, labelKey }) => (
                <button
                  key={value}
                  onClick={() => toggleIntolerance(value)}
                  className={`p-2 rounded-xl border text-sm font-medium transition-all ${
                    (data.food_intolerances || []).includes(value)
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                  }`}
                >
                  {t(language, labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>{t(language, 'step3_fav')}</Label>
            <Input
              className="mt-1"
              placeholder={t(language, 'step3_fav_placeholder')}
              value={data.favorite_foods}
              onChange={(e) => update({ favorite_foods: e.target.value })}
            />
          </div>

          <div>
            <Label>{t(language, 'step3_disliked')}</Label>
            <Input
              className="mt-1"
              placeholder={t(language, 'step3_disliked_placeholder')}
              value={data.disliked_foods}
              onChange={(e) => update({ disliked_foods: e.target.value })}
            />
          </div>

          <div>
            <Label className="mb-2 block">Orario pranzo preferito</Label>
            <div className="grid grid-cols-3 gap-2">
              {LUNCH_TIMES.map((time) => (
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

          <div>
            <Label className="mb-2 block">Orario cena preferito</Label>
            <div className="grid grid-cols-3 gap-2">
              {DINNER_TIMES.map((time) => (
                <button
                  key={time}
                  onClick={() => update({ dinner_time_preference: time })}
                  className={`p-2 rounded-xl border text-sm font-medium transition-all ${
                    data.dinner_time_preference === time
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        onClick={onNext}
        disabled={wantsRestaurants === undefined || wantsRestaurants === null}
      >
        {t(language, 'continue')}
      </Button>
    </div>
  );
}