import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Utensils, ShoppingBag, TreePine, Building2, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import { isGuidable, generateActivityGuide, generateAlternativeActivity } from '@/lib/guideGenerator';
import ActivityGuideModal from '@/components/trip/ActivityGuideModal';

const typeConfig = {
  ristorante: { icon: Utensils, color: 'bg-orange-100 text-orange-700', badge: 'Ristorante' },
  museo: { icon: Building2, color: 'bg-purple-100 text-purple-700', badge: 'Museo' },
  parco: { icon: TreePine, color: 'bg-green-100 text-green-700', badge: 'Parco' },
  shopping: { icon: ShoppingBag, color: 'bg-pink-100 text-pink-700', badge: 'Shopping' },
  attrazione: { icon: MapPin, color: 'bg-blue-100 text-blue-700', badge: 'Attrazione' },
  trasporto: { icon: Clock, color: 'bg-gray-100 text-gray-700', badge: 'Trasporto' },
};

export default function ItineraryTab({ trip, onGuideSaved, onItineraryUpdated }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [localGuides, setLocalGuides] = useState({});
  const [generatingFor, setGeneratingFor] = useState(null);
  const [replacingFor, setReplacingFor] = useState(null);

  // Local itinerary state so we can swap activities immediately
  const [localItinerary, setLocalItinerary] = useState(null);
  const itinerary = localItinerary || trip.itinerary;

  if (!itinerary?.length) {
    return <div className="text-center py-10 text-muted-foreground">Itinerario non ancora generato</div>;
  }

  const guides = { ...(trip.activity_guides || {}), ...localGuides };
  const guide = selectedActivity ? guides[selectedActivity.name] : null;

  const handleGuideClick = async (act) => {
    setSelectedActivity(act);
    if (!guides[act.name]) {
      setGeneratingFor(act.name);
      const generated = await generateActivityGuide(act, trip.destination);
      setLocalGuides((prev) => ({ ...prev, [act.name]: generated }));
      setGeneratingFor(null);
      onGuideSaved?.({ ...guides, [act.name]: generated });
    }
  };

  const handleReplaceActivity = async (act, day) => {
    setReplacingFor(act.name);
    const alternative = await generateAlternativeActivity(act, day, trip);
    // Replace in local itinerary
    const newItinerary = itinerary.map((d) => {
      if (d.day !== day.day) return d;
      return {
        ...d,
        activities: d.activities.map((a) => a.name === act.name ? { ...alternative } : a),
      };
    });
    setLocalItinerary(newItinerary);
    setReplacingFor(null);
    // Persist to DB
    onItineraryUpdated?.(newItinerary);
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
                const config = typeConfig[act.type] || typeConfig.attrazione;
                const Icon = config.icon;
                const hasGuide = isGuidable(act);
                const guideReady = hasGuide && !!guides[act.name] && generatingFor !== act.name;
                const isReplacing = replacingFor === act.name;

                return (
                  <div key={i} className={`bg-white rounded-2xl p-4 shadow-sm border transition-opacity ${isReplacing ? 'opacity-50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl ${config.color} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-indigo-600">{act.time}</span>
                          <span className="font-semibold text-gray-900">{act.name}</span>
                          <Badge variant="secondary" className={config.color}>{config.badge}</Badge>
                        </div>
                        {act.description && (
                          <p className="text-sm text-muted-foreground mt-1">{act.description}</p>
                        )}
                        {act.duration_minutes && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {act.duration_minutes} min
                          </p>
                        )}
                        {act.tip && (
                          <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
                            💡 {act.tip}
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
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
                            Prenota / Recensioni
                          </a>
                          {hasGuide && (
                            <button
                              onClick={() => handleGuideClick(act)}
                              disabled={generatingFor === act.name}
                              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                                guideReady
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                  : generatingFor === act.name
                                  ? 'bg-indigo-100 text-indigo-400 border border-indigo-200'
                                  : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100'
                              }`}
                            >
                              <BookOpen className="w-3 h-3" />
                              {generatingFor === act.name ? 'Generando...' : guideReady ? 'Apri guida AI' : 'Guida AI'}
                            </button>
                          )}
                          {act.type !== 'trasporto' && (
                            <button
                              onClick={() => handleReplaceActivity(act, day)}
                              disabled={isReplacing}
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3 h-3 ${isReplacing ? 'animate-spin' : ''}`} />
                              {isReplacing ? 'Cercando...' : 'Cambia'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
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