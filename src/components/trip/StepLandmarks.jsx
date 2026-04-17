import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, MapPin, Landmark } from 'lucide-react';
import { getLandmarksForCity } from '@/lib/landmarksCache';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const CATEGORY_EMOJI = {
  monument: '🏛️',
  museum: '🖼️',
  church: '⛪',
  nature: '🌿',
  square: '🏙️',
  palace: '🏰',
  bridge: '🌉',
  viewpoint: '🔭',
  market: '🛒',
  park: '🌳',
};

export default function StepLandmarks({ data, update, onNext }) {
  const { language } = useLanguage();
  const [landmarks, setLandmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wished = data.wished_landmarks || [];

  useEffect(() => {
    if (!data.destination) return;
    setLoading(true);
    setError(null);
    getLandmarksForCity(data.destination, data.country)
      .then((result) => setLandmarks(result))
      .catch(() => setError('Impossibile caricare i monumenti.'))
      .finally(() => setLoading(false));
  }, [data.destination, data.country]);

  const toggleWished = (name) => {
    if (wished.includes(name)) {
      update({ wished_landmarks: wished.filter((n) => n !== name) });
    } else {
      update({ wished_landmarks: [...wished, name] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {t(language, 'step_landmarks_title') || `Cosa visitare a ${data.destination}?`}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t(language, 'step_landmarks_subtitle') || 'Segna con ❤️ i luoghi che vuoi assolutamente visitare — li includeremo nel tuo itinerario.'}
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-muted-foreground">Caricamento monumenti di {data.destination}...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && landmarks.length > 0 && (
        <>
          {wished.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
              <Heart className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" />
              {wished.length} {wished.length === 1 ? 'luogo desiderato' : 'luoghi desiderati'} — saranno inclusi nel tuo trip
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {landmarks.map((lm) => {
              const isWished = wished.includes(lm.name);
              return (
                <button
                  key={lm.name}
                  onClick={() => toggleWished(lm.name)}
                  className={`relative rounded-2xl overflow-hidden border-2 text-left transition-all duration-150 group ${
                    isWished
                      ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                      : 'border-transparent hover:border-indigo-200'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-28 bg-slate-200 overflow-hidden">
                    <img
                      src={lm.image_url}
                      alt={lm.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-2 left-2 text-base">
                      {CATEGORY_EMOJI[lm.category] || '📍'}
                    </div>

                    {/* Wished heart */}
                    <div
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 ${
                        isWished
                          ? 'bg-indigo-500 shadow-md'
                          : 'bg-black/30 group-hover:bg-black/50'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-all ${
                          isWished ? 'fill-white text-white' : 'text-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className={`p-2.5 ${isWished ? 'bg-indigo-50' : 'bg-white'}`}>
                    <p className={`text-xs font-bold leading-tight mb-0.5 ${isWished ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {lm.name}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">
                      {lm.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        onClick={onNext}
        disabled={loading}
      >
        {t(language, 'continue') || 'Continua'}
      </Button>
    </div>
  );
}