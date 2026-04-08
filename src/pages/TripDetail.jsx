import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Download, MapPin, Hotel, Plane, Wallet } from 'lucide-react';
import ItineraryTab from '@/components/trip/ItineraryTab';
import MapTab from '@/components/trip/MapTab';
import HotelsTab from '@/components/trip/HotelsTab';
import AirportTab from '@/components/trip/AirportTab';
import ExpensesTab from '@/components/trip/ExpensesTab';
import { generateTripWithAI } from '@/lib/tripGenerator';
import { generateDayGuides, generateActivityGuide, isGuidable } from '@/lib/guideGenerator';
import { exportTripPDF } from '@/lib/pdfExporter';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => base44.entities.Trip.filter({ id }),
    select: (data) => data[0],
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Trip.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trip', id] }),
  });

  useEffect(() => {
    if (trip && !trip.itinerary?.length && !isGenerating) {
      handleGenerate(trip);
    }
  }, [trip]);

  const handleGenerate = async (tripData) => {
    setIsGenerating(true);
    const result = await generateTripWithAI(tripData || trip);
    await updateMutation.mutateAsync(result);
    setIsGenerating(false);

    // Generate only day 1 guides in background
    const fullTrip = { ...(tripData || trip), ...result };
    generateDayGuides(fullTrip, 1).then((activity_guides) => {
      updateMutation.mutate({ activity_guides });
    });
  };

  if (isLoading || isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-300 mx-auto mb-4" />
          <p className="text-xl font-semibold">{isGenerating ? (language === 'it' ? "L'AI sta pianificando il tuo viaggio..." : t(language, 'home_cta_new') + '...') : t(language, 'back') + '...'}</p>
          {isGenerating && <p className="text-blue-200 mt-2">{language === 'it' ? 'Potrebbe richiedere qualche secondo' : '...'}</p>}
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="relative h-48 md:h-64 bg-gradient-to-br from-indigo-500 to-sky-600 flex items-end"
        style={trip.cover_image ? { backgroundImage: `url(${trip.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full px-6 pb-6 flex items-end justify-between">
          <div>
            <button onClick={() => navigate('/my-trips')} className="text-white/80 hover:text-white flex items-center gap-1 text-sm mb-2">
              <ArrowLeft className="w-4 h-4" /> {t(language, 'my_trips_title')}
            </button>
            <h1 className="text-3xl font-bold text-white">{trip.destination}</h1>
            {trip.country && <p className="text-white/80">{trip.country}</p>}
          </div>
          <Button
            onClick={() => exportTripPDF(trip)}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="itinerary">
          <TabsList className="w-full grid grid-cols-5 mb-6">
            <TabsTrigger value="itinerary" className="gap-1 text-xs">
              <MapPin className="w-3 h-3" /> Tour
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-1 text-xs">
              🗺️ {t(language, 'tab_map')}
            </TabsTrigger>
            <TabsTrigger value="hotels" className="gap-1 text-xs">
              <Hotel className="w-3 h-3" /> {t(language, 'tab_hotels')}
            </TabsTrigger>
            <TabsTrigger value="airport" className="gap-1 text-xs">
              <Plane className="w-3 h-3" /> {t(language, 'tab_airport')}
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-1 text-xs">
              <Wallet className="w-3 h-3" /> Budget
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary">
            <ItineraryTab
              trip={trip}
              onGuideSaved={(activity_guides) => updateMutation.mutate({ activity_guides })}
              onItineraryUpdated={(itinerary) => updateMutation.mutate({ itinerary })}
              onStatusSaved={(activity_status) => updateMutation.mutate({ activity_status })}
              onExpenseSaved={(activity_expenses) => updateMutation.mutate({ activity_expenses })}
            />
          </TabsContent>
          <TabsContent value="map">
            <MapTab trip={trip} />
          </TabsContent>
          <TabsContent value="hotels">
            <HotelsTab trip={trip} />
          </TabsContent>
          <TabsContent value="airport">
            <AirportTab trip={trip} />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesTab
              trip={trip}
              onSave={(data) => updateMutation.mutate(data)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}