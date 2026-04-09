import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Utensils, ShoppingBag, TreePine, Building2, ExternalLink, RefreshCw, CheckCircle2, MinusCircle, ChevronDown, Bus, Plane } from 'lucide-react';
import { isGuidable, generateActivityGuide, generateAlternativeActivity } from '@/lib/guideGenerator';
import ActivityGuideModal from '@/components/trip/ActivityGuideModal';
import ActivityExpenseButton from '@/components/trip/ActivityExpenseButton';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const typeConfig = {
  ristorante: { icon: Utensils, color: 'bg-orange-50 text-orange-600', badge: 'Restaurant' },
  museo: { icon: Building2, color: 'bg-purple-50 text-purple-600', badge: 'Museum' },
  parco: { icon: TreePine, color: 'bg-emerald-50 text-emerald-600', badge: 'Park' },
  shopping: { icon: ShoppingBag, color: 'bg-pink-50 text-pink-600', badge: 'Shopping' },
  attrazione: { icon: MapPin, color: 'bg-blue-50 text-blue-600', badge: 'Attraction' },
  trasporto: { icon: Bus, color: 'bg-slate-100 text-slate-600', badge: 'Transit' },
};

// Special airport transfer card component
function AirportTransferCard({ act }) {
  const isArrival = act.name?.startsWith('🛬');
  const steps = act.description ? act.description.split(/\n|;|\.|(?=\d+\.)/).filter(s => s.trim().length > 3) : [];

  return (
    <div className={`rounded-2xl border-2 shadow-sm overflow-hidden ${isArrival ? 'border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50' : 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'}`}>
      {/* Header */}
      <div className={`px-5 py-4 flex items-center gap-3 ${isArrival ? 'bg-sky-500' : 'bg-amber-500'}`}>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          {isArrival ? <Plane className="w-5 h-5 text-white rotate-[45deg]" /> : <Plane className="w-5 h-5 text-white -rotate-45" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight">{act.name}</p>
          <p className="text-white/75 text-xs mt-0.5">{isArrival ? '🛬 Trasferimento arrivo' : '🛫 Trasferimento partenza'}</p>
        </div>
        <div className="text-white/80 text-xs font-semibold bg-white/15 rounded-full px-3 py-1">
          <Bus className="w-3.5 h-3.5 inline mr-1" />
          Mezzi pubblici
        </div>
      </div>

      {/* Steps */}
      <div className="px-5 py-4">
        {steps.length > 0 ? (
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${isArrival ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700 leading-snug">{step.replace(/^\d+[\.\)]\s*/, '').trim()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">{act.description}</p>
        )}
        {act.tip && (
          <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium flex items-start gap-2 ${isArrival ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'}`}>
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{act.tip}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusDropdown({ status, onChange, language }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = [
    { value: null, label: t(language, 'status_todo'), icon: Clock, className: 'text-slate-500' },
    { value: 'done', label: t(language, 'status_done'), icon: CheckCircle2, className: 'text-emerald-600' },
    { value: 'skip', label: t(language, 'status_skip'), icon: MinusCircle, className: 'text-slate-400' },
  ];
  const current = options.find((o) => o.value === status) || options[0];
  const Icon = current.icon;

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-all duration-150 ${
          status === 'done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          status === 'skip' ? 'bg-slate-50 text-slate-400 border-slate-200' :
          'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Icon className="w-3 h-3" />
        {current.label}
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[130px]">
          {options.map((opt) => {
            const OIcon = opt.icon;
            return (
              <button
                key={opt.value ?? 'null'}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-slate-50 ${opt.className}`}
              >
                <OIcon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TransitLink({ from, to, destination }) {
  if (!from || !to) return null;
  const origin = from.lat && from.lng ? `${from.lat},${from.lng}` : encodeURIComponent(`${from.name} ${destination}`);
  const dest = to.lat && to.lng ? `${to.lat},${to.lng}` : encodeURIComponent(`${to.name} ${destination}`);
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=transit`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-2 mx-4 my-1 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold hover:bg-sky-100 transition-all"
    >
      <Bus className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{from.name} → {to.name}</span>
      <ExternalLink className="w-3 h-3 ml-auto shrink-0" />
    </a>
  );
}

export default function ItineraryTab({ trip, showTransit = false, onGuideSaved, onItineraryUpdated, onStatusSaved, onExpenseSaved }) {
  const { language } = useLanguage();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [localGuides, setLocalGuides] = useState({});
  const [generatingFor, setGeneratingFor] = useState(null);
  const [replacingFor, setReplacingFor] = useState(null);
  const [localItinerary, setLocalItinerary] = useState(null);
  const [activityStatus, setActivityStatus] = useState(trip.activity_status || {});
  const [activityExpenses, setActivityExpenses] = useState(trip.activity_expenses || {});
  const activityRefs = useRef({});

  const itinerary = localItinerary || trip.itinerary;

  // On mount, scroll to the next activity after the last marked one
  useEffect(() => {
    if (!itinerary?.length) return;
    const allActivities = itinerary.flatMap((d) => d.activities || []);
    let lastMarkedIndex = -1;
    allActivities.forEach((a, i) => {
      const s = activityStatus[a.name];
      if (s === 'done' || s === 'skip') lastMarkedIndex = i;
    });
    if (lastMarkedIndex === -1) return;
    const targetAct = allActivities[lastMarkedIndex + 1] || allActivities[lastMarkedIndex];
    setTimeout(() => {
      if (targetAct && activityRefs.current[targetAct.name]) {
        activityRefs.current[targetAct.name].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }, []);

  if (!itinerary?.length) {
    return <div className="text-center py-10 text-sm text-slate-400">{t(language, 'itinerary_empty')}</div>;
  }

  const guides = { ...(trip.activity_guides || {}), ...localGuides };
  const guide = selectedActivity ? guides[selectedActivity.name] : null;

  const handleBoxClick = async (act) => {
    if (!isGuidable(act)) return;
    setSelectedActivity(act);
    if (!guides[act.name]) {
      setGeneratingFor(act.name);
      const generated = await generateActivityGuide(act, trip.destination, language);
      setLocalGuides((prev) => ({ ...prev, [act.name]: generated }));
      setGeneratingFor(null);
      onGuideSaved?.({ ...guides, [act.name]: generated });
    }
  };

  const handleReplaceActivity = async (act, day) => {
    setReplacingFor(act.name);
    const alternative = await generateAlternativeActivity(act, day, trip, language);
    const newItinerary = itinerary.map((d) => {
      if (d.day !== day.day) return d;
      return { ...d, activities: d.activities.map((a) => a.name === act.name ? { ...alternative } : a) };
    });
    setLocalItinerary(newItinerary);
    setReplacingFor(null);
    onItineraryUpdated?.(newItinerary);
  };

  const handleStatusChange = (actName, value) => {
    setActivityStatus((prev) => {
      const updated = { ...prev, [actName]: value };
      // Persist to DB
      onStatusSaved?.(updated);
      // Scroll to next activity
      setTimeout(() => {
        const allActivities = (itinerary || []).flatMap((d) => d.activities || []);
        let lastMarkedIndex = -1;
        allActivities.forEach((a, i) => {
          const s = updated[a.name];
          if (s === 'done' || s === 'skip') lastMarkedIndex = i;
        });
        const nextAct = allActivities[lastMarkedIndex + 1];
        if (nextAct && activityRefs.current[nextAct.name]) {
          activityRefs.current[nextAct.name].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return updated;
    });
  };

  return (
    <>
      <div className="space-y-8">
        {itinerary.map((day) => (
          <div key={day.day}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {day.day}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{day.title}</h3>
                {day.date && <p className="text-xs text-slate-500 mt-0.5">{day.date}</p>}
              </div>
            </div>

            <div className="space-y-2 ml-4 pl-6 border-l-2 border-slate-200">
              {(day.activities || []).map((act, i) => {
                const nextAct = (day.activities || [])[i + 1];
                const isAirportTransfer = act.type === 'trasporto' && (act.name?.startsWith('🛬') || act.name?.startsWith('🛫'));
                const config = typeConfig[act.type] || typeConfig.attrazione;
                const Icon = config.icon;
                const hasGuide = isGuidable(act);
                const isReplacing = replacingFor === act.name;
                const isLoading = generatingFor === act.name;
                const status = activityStatus[act.name] ?? null;

                if (isAirportTransfer) {
                  return (
                    <div key={i} ref={(el) => { activityRefs.current[act.name] = el; }}>
                      <AirportTransferCard act={act} />
                    </div>
                  );
                }

                // Card styles based on status
                const cardClass =
                  status === 'done'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : status === 'skip'
                    ? 'bg-slate-50 border-slate-200 opacity-50'
                    : 'bg-white border border-slate-200';

                return (
                  <div key={i}>
                  <div
                    ref={(el) => { activityRefs.current[act.name] = el; }}
                    onClick={() => handleBoxClick(act)}
                    className={`rounded-xl p-4 border transition-all duration-150 ${cardClass} ${isReplacing ? 'opacity-40' : ''} ${hasGuide ? 'cursor-pointer hover:shadow-sm' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${status === 'skip' ? 'bg-slate-100 text-slate-400' : config.color}`}>
                        {status === 'done' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                         status === 'skip' ? <MinusCircle className="w-4 h-4 text-slate-400" /> :
                         <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-medium ${status === 'skip' ? 'text-slate-400' : 'text-indigo-500'}`}>{act.time}</span>
                          <span className={`font-semibold text-sm ${status === 'skip' ? 'text-slate-400 line-through' : status === 'done' ? 'text-slate-500' : 'text-slate-900'}`}>{act.name}</span>
                          <Badge variant="secondary" className={`text-xs font-medium ${status === 'skip' ? 'bg-slate-100 text-slate-400' : config.color}`}>{config.badge}</Badge>
                          {hasGuide && !isLoading && status !== 'skip' && (
                            <span className="text-xs text-indigo-400 font-medium">{t(language, 'ai_guide_hint')}</span>
                          )}
                          {isLoading && <span className="text-xs text-indigo-400 italic animate-pulse">{t(language, 'ai_guide_loading')}</span>}
                        </div>
                        {act.description && status !== 'skip' && (
                          <p className="text-sm text-muted-foreground mt-1">{act.description}</p>
                        )}
                        {act.duration_minutes && status !== 'skip' && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {act.duration_minutes} min
                          </p>
                        )}
                        {act.tip && status !== 'skip' && (
                          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                            💡 {act.tip}
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                          <StatusDropdown
                            status={status}
                            onChange={(val) => handleStatusChange(act.name, val)}
                            language={language}
                          />
                          <ActivityExpenseButton
                            actName={act.name}
                            expenses={activityExpenses[act.name] || []}
                            currency={trip.budget_currency || 'EUR'}
                            onSave={(entries) => {
                              const updated = { ...activityExpenses, [act.name]: entries };
                              setActivityExpenses(updated);
                              onExpenseSaved?.(updated);
                            }}
                          />
                          {status !== 'skip' && (
                            <>
                              <a
                                href={`https://www.google.com/maps/search/${encodeURIComponent(act.name + ' ' + trip.destination)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors duration-150"
                              >
                                <MapPin className="w-3 h-3" />
                                Google Maps
                              </a>
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent('prenota ' + act.name + ' ' + trip.destination)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors duration-150"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {t(language, 'book_reviews')}
                              </a>
                              {act.type !== 'trasporto' && (
                                <button
                                  onClick={() => handleReplaceActivity(act, day)}
                                  disabled={isReplacing}
                                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors duration-150 disabled:opacity-50"
                                >
                                  <RefreshCw className={`w-3 h-3 ${isReplacing ? 'animate-spin' : ''}`} />
                                  {isReplacing ? t(language, 'searching') : t(language, 'change_activity')}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {showTransit && nextAct && status !== 'skip' && nextAct && activityStatus[nextAct.name] !== 'skip' && (
                    <TransitLink from={act} to={nextAct} destination={trip.destination} />
                  )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedActivity && (
        <ActivityGuideModal
          activity={selectedActivity}
          guide={guide}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </>
  );
}