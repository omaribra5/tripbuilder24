import { useState } from 'react';
import { X, MapPin, Clock, Euro, Lightbulb, ChevronRight, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ActivityGuideModal({ activity, guide, onClose }) {
  const [activeStep, setActiveStep] = useState(null);

  const isLoading = !guide;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full md:max-w-2xl md:rounded-3xl max-h-[95vh] overflow-y-auto flex flex-col">
        
        {/* Hero Image */}
        <div className="relative h-52 bg-gradient-to-br from-indigo-500 to-sky-600 shrink-0">
          {guide?.photo_url && (
            <img src={guide.photo_url} alt={activity.name} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                🗺️ Guida AI
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">{activity.name}</h2>
            {activity.time && <p className="text-white/80 text-sm mt-0.5">⏰ {activity.time}</p>}
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20 flex-col gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-muted-foreground font-medium">Sto preparando la tua guida...</p>
          </div>
        ) : (
          <div className="p-5 space-y-6">
            
            {/* Introduction */}
            {guide.introduction && (
              <div>
                <p className="text-gray-700 leading-relaxed text-sm">{guide.introduction}</p>
              </div>
            )}

            {/* Practical Info */}
            {guide.practical_info && (
              <div className="bg-indigo-50 rounded-2xl p-4 grid grid-cols-3 gap-3">
                {guide.practical_info.duration && (
                  <div className="text-center">
                    <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Durata</p>
                    <p className="text-sm font-semibold text-gray-800">{guide.practical_info.duration}</p>
                  </div>
                )}
                {guide.practical_info.price && (
                  <div className="text-center">
                    <Euro className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Prezzo</p>
                    <p className="text-sm font-semibold text-gray-800">{guide.practical_info.price}</p>
                  </div>
                )}
                {guide.practical_info.best_time && (
                  <div className="text-center">
                    <Star className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Orario migliore</p>
                    <p className="text-sm font-semibold text-gray-800">{guide.practical_info.best_time}</p>
                  </div>
                )}
              </div>
            )}

            {/* Visit Steps */}
            {guide.visit_steps?.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Percorso di visita
                </h3>
                <div className="space-y-2">
                  {guide.visit_steps.map((step, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <button
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => setActiveStep(activeStep === i ? null : i)}
                      >
                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {step.step_number || i + 1}
                        </div>
                        <span className="font-semibold text-gray-900 flex-1">{step.title}</span>
                        <ChevronRight
                          className={`w-4 h-4 text-muted-foreground transition-transform ${activeStep === i ? 'rotate-90' : ''}`}
                        />
                      </button>
                      {activeStep === i && (
                        <div className="pb-4 space-y-3">
                          {step.photo_url && (
                            <div className="mx-4 rounded-xl overflow-hidden h-40">
                              <img
                                src={step.photo_url}
                                alt={step.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          )}
                          <div className="px-4 ml-6 space-y-2">
                            <p className="text-sm text-gray-700 leading-relaxed">{step.description}</p>
                            {step.tip && (
                              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-xs text-amber-700">
                                💡 {step.tip}
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

            {/* Tips */}
            {guide.practical_info?.tips?.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Consigli pratici
                </h3>
                <ul className="space-y-2">
                  {guide.practical_info.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-indigo-500 font-bold mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Insider Secret */}
            {guide.insider_secret && (
              <div className="bg-gradient-to-r from-indigo-600 to-sky-600 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🤫</span>
                  <span className="font-bold">Segreto da insider</span>
                </div>
                <p className="text-sm text-indigo-100 leading-relaxed">{guide.insider_secret}</p>
              </div>
            )}

            <Button onClick={onClose} className="w-full rounded-2xl" variant="outline">
              Chiudi guida
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}