import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Utensils, ShoppingBag, TreePine, Building2, ExternalLink, RefreshCw, CheckCircle2, MinusCircle, ChevronDown, Bus, Plane } from 'lucide-react';
import { isGuidable, generateActivityGuide, generateAlternativeActivity } from '@/lib/guideGenerator';
import ActivityGuideModal from '@/components/trip/ActivityGuideModal';
import ActivityExpenseButton from '@/components/trip/ActivityExpenseButton';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const typeConfig = {
  ristorante: { icon: Utensils, color: 'bg-orange-100 text-orange-700', badge: 'Ristorante' },
  museo: { icon: Building2, color: 'bg-purple-100 text-purple-700', badge: 'Museo' },
  parco: { icon: TreePine, color: 'bg-green-100 text-green-700', badge: 'Parco' },
  shopping: { icon: ShoppingBag, color: 'bg-pink-100 text-pink-700', badge: 'Shopping' },
  attrazione: { icon: MapPin, color: 'bg-blue-100 text-blue-700', badge: 'Attrazione' },
  trasporto: { icon: Bus, color: 'bg-sky-100 text-sky-700', badge: 'Trasporto' },
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

// Status dropdown component
function StatusDropdown({ status, onChange, language }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = [
    { value: null, label: t(language, 'status_todo'), icon: Clock, className: 'text-gray-500' },
    { value: 'done', label: t(language, 'status_done'), icon: CheckCircle2, className: 'text-green-600' },
    { value: 'skip', label: t(language, 'status_skip'), icon: MinusCircle, className: 'text-gray-400' },
  ];
  const current = options.find((o) => o.value === status) || options[0];
  const Icon = current.icon;

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
          status === 'done' ? 'bg-green-50 text-green-600 border-green-200' :
          status === 'skip' ? 'bg-gray-100 text-gray-400 border-gray-200' :
          'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Icon className="w-3 h-3" />
        {current.label}
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white border rounded-xl shadow-lg py-1 min-w-[130px]">
          {options.map((opt) => {
            const OIcon = opt.icon;
            return (
              <button
                key={opt.value ?? 'null'}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 ${opt.className}`}
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
    return <div className="text-center py-10 text-muted-foreground">{t(language, 'itinerary_empty')}</div>;
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
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                {day.day}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{day.title}</h3>
                {day.date && <p className="text-sm text-muted-foreground">{day.date}</p>}
              </div>
            </div>

            <div className="space-y-3 ml-4 pl-6 border-l-2 border-indigo-100">
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
                    ? 'bg-green-50 border-green-200 opacity-80'
                    : status === 'skip'
                    ? 'bg-gray-50 border-gray-200 opacity-50'
                    : 'bg-white border';

                return (
                  <div key={i}>
                  <div
                    ref={(el) => { activityRefs.current[act.name] = el; }}
                    onClick={() => handleBoxClick(act)}
                    className={`rounded-2xl p-4 shadow-sm border transition-all ${cardClass} ${isReplacing ? 'opacity-40' : ''} ${hasGuide ? 'cursor-pointer hover:shadow-md' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${status === 'skip' ? 'bg-gray-100 text-gray-400' : config.color}`}>
                        {status === 'done' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                         status === 'skip' ? <MinusCircle className="w-4 h-4 text-gray-400" /> :
                         <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold ${status === 'skip' ? 'text-gray-400' : 'text-indigo-600'}`}>{act.time}</span>
                          <span className={`font-semibold ${status === 'skip' ? 'text-gray-400 line-through' : status === 'done' ? 'text-gray-600' : 'text-gray-900'}`}>{act.name}</span>
                          <Badge variant="secondary" className={status === 'skip' ? 'bg-gray-100 text-gray-400' : config.color}>{config.badge}</Badge>
                          {hasGuide && !isLoading && status !== 'skip' && (
                            <span className="text-xs text-indigo-400 italic">{t(language, 'ai_guide_hint')}</span>
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
                          <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
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
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all"
                              >
                                <MapPin className="w-3 h-3" />
                                Google Maps
                              </a>
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent('prenota ' + act.name + ' ' + trip.destination)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {t(language, 'book_reviews')}
                              </a>
                              {act.type !== 'trasporto' && (
                                <button
                                  onClick={() => handleReplaceActivity(act, day)}
                                  disabled={isReplacing}
                                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all disabled:opacity-50"
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