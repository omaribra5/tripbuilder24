import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Download, MapPin, Wallet } from 'lucide-react';
import ItineraryTab from '@/components/trip/ItineraryTab';
import MapTab from '@/components/trip/MapTab';
import ExpensesTab from '@/components/trip/ExpensesTab';
import DocumentsTab from '@/components/trip/DocumentsTab';
import { generateTripWithAI } from '@/lib/tripGenerator';
import { generateDayGuides } from '@/lib/guideGenerator';
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
    const result = await generateTripWithAI(tripData || trip, language);
    await updateMutation.mutateAsync(result);
    setIsGenerating(false);

    const fullTrip = { ...(tripData || trip), ...result };
    generateDayGuides(fullTrip, 1, language).then((activity_guides) => {
      updateMutation.mutate({ activity_guides });
    });
  };

  if (isLoading || isGenerating) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-700">{isGenerating ? t(language, 'generating_trip') : '...'}</p>
          {isGenerating && <p className="text-xs text-slate-400 mt-1">{t(language, 'generating_wait')}</p>}
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div
        className="relative h-56 md:h-72 bg-slate-800 flex items-end"
        style={trip.cover_image ? { backgroundImage: `url(${trip.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full px-6 pb-6 flex items-end justify-between">
          <div>
            <button onClick={() => navigate('/my-trips')} className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-medium mb-3 transition-colors duration-150">
              <ArrowLeft className="w-3.5 h-3.5" /> {t(language, 'my_trips_title')}
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{trip.destination}</h1>
            {trip.country && <p className="text-white/60 text-sm mt-0.5">{trip.country}</p>}
          </div>
          <Button
            onClick={() => exportTripPDF(trip)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="itinerary">
          <TabsList className="w-full grid grid-cols-4 mb-6 bg-white border border-slate-200 shadow-sm p-1 rounded-lg h-auto">
            <TabsTrigger value="itinerary" className="gap-1.5 text-xs py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all">
              <MapPin className="w-3.5 h-3.5" /> {t(language, 'tab_itinerary')}
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-1.5 text-xs py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all">
              {t(language, 'tab_map')}
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-1.5 text-xs py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all">
              <Wallet className="w-3.5 h-3.5" /> Budget
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5 text-xs py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all">
              Docs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary">
            <ItineraryTab
              trip={trip}
              showTransit={true}
              onGuideSaved={(activity_guides) => updateMutation.mutate({ activity_guides })}
              onItineraryUpdated={(itinerary) => updateMutation.mutate({ itinerary })}
              onStatusSaved={(activity_status) => updateMutation.mutate({ activity_status })}
              onExpenseSaved={(activity_expenses) => updateMutation.mutate({ activity_expenses })}
            />
          </TabsContent>
          <TabsContent value="map">
            <MapTab trip={trip} />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesTab
              trip={trip}
              onSave={(data) => updateMutation.mutate(data)}
            />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsTab
              trip={trip}
              onSave={(documents) => updateMutation.mutate({ documents })}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}