import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Calendar, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

export default function Home() {
  const { language } = useLanguage();

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date', 6),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 text-white">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Hero */}
        <div className="mb-6 flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm backdrop-blur">
          <MapPin className="w-4 h-4 text-yellow-300" />
          <span>{t(language, 'home_tagline')}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {t(language, 'home_title_1')}<br />
          <span className="text-yellow-300">{t(language, 'home_title_2')}</span>
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mb-10">
          {t(language, 'home_subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link to="/new-trip">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 text-lg rounded-full">
              {t(language, 'home_cta_new')}
            </Button>
          </Link>
          <Link to="/my-trips">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full">
              {t(language, 'home_cta_mine')}
            </Button>
          </Link>
        </div>

        {/* Trips preview */}
        <div className="w-full max-w-4xl">
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-white/50 mx-auto" />
          ) : trips.length === 0 ? (
            <Link to="/new-trip">
              <div className="border-2 border-dashed border-white/30 rounded-3xl p-10 flex flex-col items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <Plus className="w-7 h-7 text-yellow-300" />
                </div>
                <p className="text-white/80 font-medium text-lg">Nessun viaggio ancora</p>
                <p className="text-blue-200 text-sm">Clicca per pianificare il tuo primo viaggio con l'AI</p>
              </div>
            </Link>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trips.map((trip) => (
                <Link key={trip.id} to={`/trip/${trip.id}`}>
                  <div className="bg-white/10 backdrop-blur rounded-2xl overflow-hidden hover:bg-white/20 transition-all text-left">
                    {trip.cover_image ? (
                      <img src={trip.cover_image} alt={trip.destination} className="w-full h-28 object-cover" />
                    ) : (
                      <div className="w-full h-28 bg-gradient-to-br from-indigo-400/50 to-sky-400/50 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-white/60" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-bold text-white truncate">{trip.destination}</p>
                      {trip.start_date && (
                        <p className="text-blue-200 text-xs flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(trip.start_date), 'd MMM yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              <Link to="/new-trip">
                <div className="bg-white/10 backdrop-blur rounded-2xl h-full min-h-[140px] flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer border-2 border-dashed border-white/20">
                  <Plus className="w-6 h-6 text-yellow-300" />
                  <span className="text-sm text-white/70">Nuovo viaggio</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}