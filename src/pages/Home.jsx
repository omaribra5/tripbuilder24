import { Link } from 'react-router-dom';
import { MapPin, Plus, Calendar, ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { useAuth } from '@/lib/AuthContext';

export default function Home() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips', user?.email],
    queryFn: () => base44.entities.Trip.filter({ created_by: user.email }, '-created_date', 6),
    enabled: !!user?.email,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-500 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white/90">Wandr</span>
        </div>
        <LanguageSwitcher />
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full mb-8">
            <Globe className="w-3.5 h-3.5" />
            {t(language, 'home_tagline')}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            {t(language, 'home_title_1')}{' '}
            <span className="text-indigo-400">{t(language, 'home_title_2')}</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">
            {t(language, 'home_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/new-trip">
              <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-150 text-sm">
                <Plus className="w-4 h-4" />
                {t(language, 'home_cta_new')}
              </button>
            </Link>
            <Link to="/my-trips">
              <button className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 font-medium px-6 py-3 rounded-lg transition-colors duration-150 text-sm border border-white/10">
                {t(language, 'home_cta_mine')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Trips preview */}
        {!isLoading && trips.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Recent trips</h2>
              <Link to="/my-trips" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trips.map((trip) => (
                <Link key={trip.id} to={`/trip/${trip.id}`}>
                  <div className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/8 hover:border-white/20 transition-all duration-150">
                    <div className="relative h-32 bg-slate-800 overflow-hidden">
                      <img
                        src={trip.cover_image || `https://source.unsplash.com/featured/400x200/?${encodeURIComponent(trip.destination)},city`}
                        alt={trip.destination}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-150"
                        onError={(e) => { e.target.style.display='none'; }}
                      />
                    </div>
                    <div className="p-3.5">
                      <p className="font-semibold text-white text-sm truncate">{trip.destination}</p>
                      {trip.start_date && (
                        <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(trip.start_date), 'd MMM yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              <Link to="/new-trip">
                <div className="border border-dashed border-white/10 rounded-xl min-h-[140px] flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-150 cursor-pointer">
                  <Plus className="w-5 h-5 text-slate-500" />
                  <span className="text-xs text-slate-500">{t(language, 'new_trip')}</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {!isLoading && trips.length === 0 && (
          <div className="mt-20">
            <Link to="/new-trip">
              <div className="border border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center gap-3 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-150 cursor-pointer max-w-md">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-slate-300 font-medium text-sm">{t(language, 'no_trips_yet')}</p>
                <p className="text-slate-500 text-xs text-center">{t(language, 'home_cta_new')}</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}