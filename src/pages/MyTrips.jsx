import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { it, enUS, fr, de, es, pt } from 'date-fns/locale';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/lib/AuthContext';

const DATE_LOCALES = { it, en: enUS, fr, de, es, pt };

const STATUS_STYLES = {
  completed: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  confirmed: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  planning:  'text-slate-500 bg-slate-50 border-slate-200',
};

export default function MyTrips() {
  const { language } = useLanguage();
  const dateLocale = DATE_LOCALES[language] || enUS;
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips', user?.email],
    queryFn: () => base44.entities.Trip.filter({ created_by: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Trip.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  });

  const handleDelete = (e, id) => {
    e.preventDefault();
    if (confirm('Delete this trip?')) deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t(language, 'my_trips_title')}</h1>
            {trips.length > 0 && <p className="text-sm text-slate-500 mt-1">{trips.length} {trips.length === 1 ? 'trip' : 'trips'}</p>}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/new-trip">
              <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150">
                <Plus className="w-4 h-4" />
                {t(language, 'my_trips_new')}
              </button>
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        )}

        {!isLoading && trips.length === 0 && (
          <div className="text-center py-24">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-slate-400" />
            </div>
            <h2 className="text-base font-semibold text-slate-700 mb-1">{t(language, 'my_trips_empty')}</h2>
            <p className="text-sm text-slate-400 mb-6">Plan your first AI-powered trip</p>
            <Link to="/new-trip">
              <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150">
                <Plus className="w-4 h-4" />
                {t(language, 'my_trips_new')}
              </button>
            </Link>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {trips.map((trip) => (
            <Link key={trip.id} to={`/trip/${trip.id}`} className="relative group block">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-150">
                <button
                  onClick={(e) => handleDelete(e, trip.id)}
                  className="absolute top-3 right-3 z-10 w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={trip.cover_image || `https://source.unsplash.com/featured/600x300/?${encodeURIComponent(trip.destination)},city,travel`}
                    alt={trip.destination}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display='none'; }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{trip.destination}</h3>
                      {trip.country && <p className="text-sm text-slate-500 mt-0.5">{trip.country}</p>}
                    </div>
                    <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded border ${STATUS_STYLES[trip.status] || STATUS_STYLES.planning}`}>
                      {trip.status === 'completed' ? t(language, 'completed') : trip.status === 'confirmed' ? t(language, 'confirmed') : t(language, 'planning')}
                    </span>
                  </div>
                  {trip.start_date && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(trip.start_date), 'd MMM yyyy', { locale: dateLocale })}
                      {trip.end_date && <> &mdash; {format(new Date(trip.end_date), 'd MMM yyyy', { locale: dateLocale })}</>}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}