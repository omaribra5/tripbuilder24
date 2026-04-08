import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import StepBasicInfo from '@/components/trip/StepBasicInfo';
import StepPreferences from '@/components/trip/StepPreferences';
import StepFood from '@/components/trip/StepFood';
import StepAccommodation from '@/components/trip/StepAccommodation';
import StepAirport from '@/components/trip/StepAirport';
import StepGenerating from '@/components/trip/StepGenerating';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

export default function NewTrip() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const STEPS = [
    t(language, 'step_destination'),
    t(language, 'step_preferences'),
    t(language, 'step_food'),
    t(language, 'step_accommodation'),
    t(language, 'step_airport'),
  ];
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [tripData, setTripData] = useState({
    destination: '',
    country: '',
    start_date: '',
    end_date: '',
    travelers: 'coppia',
    budget: 'medio',
    interests: [],
    notes: '',
    food_intolerances: [],
    favorite_foods: '',
    disliked_foods: '',
    meal_time_preference: '13:00',
    has_accommodation: null,
    accommodation_name: '',
    arrival_airport: '',
    arrival_datetime: '',
    airport_transfer_preference: 'entrambi',
  });

  const update = (fields) => setTripData((prev) => ({ ...prev, ...fields }));

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Create trip first
      const trip = await base44.entities.Trip.create({ ...tripData, status: 'planning' });
      navigate(`/trip/${trip.id}`);
    } catch (e) {
      console.error(e);
      setGenerating(false);
    }
  };

  if (generating) return <StepGenerating />;

  const stepProps = { data: tripData, update };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        {step > 0 ? (
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">{t(language, 'step_label')} {step + 1} {t(language, 'step_of')} {STEPS.length}</div>
          <div className="font-semibold">{STEPS[step]}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-1 bg-indigo-600 transition-all"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="max-w-xl mx-auto px-6 py-10">
        {step === 0 && <StepBasicInfo {...stepProps} onNext={handleNext} />}
        {step === 1 && <StepPreferences {...stepProps} onNext={handleNext} />}
        {step === 2 && <StepFood {...stepProps} onNext={handleNext} />}
        {step === 3 && <StepAccommodation {...stepProps} onNext={handleNext} />}
        {step === 4 && <StepAirport {...stepProps} onGenerate={handleGenerate} />}
      </div>
    </div>
  );
}