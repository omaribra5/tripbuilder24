import { Loader2, MapPin, UtensilsCrossed, Hotel, Plane } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

export default function StepGenerating() {
  const { language } = useLanguage();

  const steps = [
    { icon: MapPin, labelKey: 'gen_step1' },
    { icon: UtensilsCrossed, labelKey: 'gen_step2' },
    { icon: Hotel, labelKey: 'gen_step3' },
    { icon: Plane, labelKey: 'gen_step4' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 flex items-center justify-center text-white px-6">
      <div className="text-center max-w-md">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-300 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-2">{t(language, 'gen_title')}</h2>
        <p className="text-blue-200 mb-10">{t(language, 'gen_subtitle')}</p>
        <div className="space-y-3">
          {steps.map(({ icon: Icon, labelKey }) => (
            <div key={labelKey} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-left">
              <Icon className="w-5 h-5 text-yellow-300 shrink-0" />
              <span className="text-sm">{t(language, labelKey)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}