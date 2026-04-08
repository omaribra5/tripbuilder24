import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Calendar, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { it, enUS, fr, de, es, pt } from 'date-fns/locale';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const DATE_LOCALES = { it, en: enUS, fr, de, es, pt };

export default function MyTrips() {
  const { language } = useLanguage();
  const dateLocale = DATE_LOCALES[language] || enUS;
  const queryClient = useQueryClient();
  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Trip.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  });

  const handleDelete = (e, id) => {
    e.preventDefault();
    if (confirm('Eliminare questo viaggio?')) deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t(language, 'my_trips_title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/new-trip">
              <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                <Plus className="w-4 h-4" />
                {t(language, 'my_trips_new')}
              </Button>
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {!isLoading && trips.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{t(language, 'my_trips_empty')}</h2>
            <Link to="/new-trip">
              <Button className="bg-indigo-600 hover:bg-indigo-700">{t(language, 'my_trips_new')}</Button>
            </Link>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {trips.map((trip) => (
            <Link key={trip.id} to={`/trip/${trip.id}`} className="relative group">
              <div className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
                <button
                  onClick={(e) => handleDelete(e, trip.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {trip.cover_image ? (
                  <img src={trip.cover_image} alt={trip.destination} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{trip.destination}</h3>
                  {trip.country && <p className="text-muted-foreground text-sm">{trip.country}</p>}
                  {trip.start_date && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(trip.start_date), 'd MMM yyyy', { locale: dateLocale })}
                      {trip.end_date && ` → ${format(new Date(trip.end_date), 'd MMM yyyy', { locale: dateLocale })}`}
                    </div>
                  )}
                  <div className={`inline-block mt-3 px-2 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'completed' ? 'bg-green-100 text-green-700' :
                    trip.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {trip.status === 'completed' ? 'Completato' : trip.status === 'confirmed' ? 'Confermato' : 'In pianificazione'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}