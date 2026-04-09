import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hotel, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

export default function StepAccommodation({ data, update, onNext }) {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{t(language, 'step4_title')}</h2>
        <p className="text-muted-foreground">{t(language, 'step4_subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => update({ has_accommodation: true })}
          className={`p-4 rounded-2xl border-2 text-center transition-all ${
            data.has_accommodation === true
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
          }`}
        >
          <Hotel className="w-8 h-8 mx-auto mb-2" />
          <div className="font-semibold">{t(language, 'step4_yes')}</div>
        </button>

        <button
          onClick={() => update({ has_accommodation: false })}
          className={`p-4 rounded-2xl border-2 text-center transition-all ${
            data.has_accommodation === false
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
          }`}
        >
          <HelpCircle className="w-8 h-8 mx-auto mb-2" />
          <div className="font-semibold">{t(language, 'step4_no')}</div>
        </button>
      </div>

      {data.has_accommodation === true && (
        <div>
          <Label>{t(language, 'step4_hotel_label')}</Label>
          <Input
            className="mt-1"
            placeholder={t(language, 'step4_hotel_placeholder')}
            value={data.accommodation_name}
            onChange={(e) => update({ accommodation_name: e.target.value })}
          />
          <p className="text-sm text-muted-foreground mt-1">{t(language, 'step4_hotel_hint')}</p>
        </div>
      )}

      {data.has_accommodation === false && (
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <p className="text-indigo-700 text-sm font-medium">{t(language, 'step4_ai_hint')}</p>
        </div>
      )}

      <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={onNext}>
        {t(language, 'continue')}
      </Button>
    </div>
  );
}