import { useState } from 'react';
import { X, MapPin, Clock, Euro, Lightbulb, ChevronRight, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

export default function ActivityGuideModal({ activity, guide, onClose }) {
  const [activeStep, setActiveStep] = useState(null);
  const { language } = useLanguage();

  const isLoading = !guide;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full md:max-w-2xl md:rounded-2xl max-h-[95vh] overflow-y-auto flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-48 bg-slate-800 shrink-0">
          <img
            src={`https://source.unsplash.com/featured/800x400/?${encodeURIComponent(activity.name)},travel`}
            alt={activity.name}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-xs font-medium text-white/60 bg-white/10 px-2 py-1 rounded-md">
              {t(language, 'guide_badge')}
            </span>
            <h2 className="text-xl font-bold text-white mt-2 leading-tight">{activity.name}</h2>
            {activity.time && <p className="text-white/60 text-xs mt-1">{activity.time}</p>}
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20 flex-col gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-500">{t(language, 'guide_loading')}</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            
            {guide.introduction && (
              <p className="text-slate-600 leading-relaxed text-sm">{guide.introduction}</p>
            )}

            {guide.practical_info && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-3 gap-3">
                {guide.practical_info.duration && (
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">{t(language, 'guide_duration')}</p>
                    <p className="text-sm font-semibold text-slate-800">{guide.practical_info.duration}</p>
                  </div>
                )}
                {guide.practical_info.price && (
                  <div className="text-center">
                    <Euro className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">{t(language, 'guide_price')}</p>
                    <p className="text-sm font-semibold text-slate-800">{guide.practical_info.price}</p>
                  </div>
                )}
                {guide.practical_info.best_time && (
                  <div className="text-center">
                    <Star className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">{t(language, 'guide_best_time')}</p>
                    <p className="text-sm font-semibold text-slate-800">{guide.practical_info.best_time}</p>
                  </div>
                )}
              </div>
            )}

            {guide.visit_steps?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500" /> {t(language, 'guide_visit_steps')}
                </h3>
                <div className="space-y-2">
                  {guide.visit_steps.map((step, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-slate-50 transition-colors duration-150"
                        onClick={() => setActiveStep(activeStep === i ? null : i)}
                      >
                        <div className="w-6 h-6 rounded-lg bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {step.step_number || i + 1}
                        </div>
                        <span className="font-medium text-sm text-slate-900 flex-1">{step.title}</span>
                        <ChevronRight
                          className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${activeStep === i ? 'rotate-90' : ''}`}
                        />
                      </button>
                      {activeStep === i && (
                        <div className="pb-4 space-y-3">
                          <div className="mx-4 rounded-lg overflow-hidden h-32 bg-slate-100">
                            <img
                              src={`https://source.unsplash.com/featured/600x300/?${encodeURIComponent(step.title + ' ' + activity.name)},travel`}
                              alt={step.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                            />
                          </div>
                          <div className="px-4 ml-6 space-y-2">
                            <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                            {step.tip && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                                {step.tip}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guide.practical_info?.tips?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> {t(language, 'guide_tips')}
                </h3>
                <ul className="space-y-1.5">
                  {guide.practical_info.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-400 font-bold mt-0.5 shrink-0">—</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {guide.insider_secret && (
              <div className="bg-slate-900 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t(language, 'guide_insider')}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{guide.insider_secret}</p>
              </div>
            )}

            <button onClick={onClose} className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium py-2.5 rounded-lg transition-colors duration-150">
              {t(language, 'guide_close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}