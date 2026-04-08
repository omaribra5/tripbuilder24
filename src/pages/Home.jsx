import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Mic, FileText, UtensilsCrossed, Hotel, Plane } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const { language } = useLanguage();

  const features = [
    { icon: MapPin, label: t(language, 'feat_itinerary'), desc: t(language, 'feat_itinerary_desc') },
    { icon: UtensilsCrossed, label: t(language, 'feat_restaurants'), desc: t(language, 'feat_restaurants_desc') },
    { icon: Hotel, label: t(language, 'feat_hotels'), desc: t(language, 'feat_hotels_desc') },
    { icon: Plane, label: t(language, 'feat_airport'), desc: t(language, 'feat_airport_desc') },
    { icon: Mic, label: t(language, 'feat_audio'), desc: t(language, 'feat_audio_desc') },
    { icon: FileText, label: t(language, 'feat_pdf'), desc: t(language, 'feat_pdf_desc') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 text-white">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
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
        <div className="flex flex-col sm:flex-row gap-4">
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

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-20 max-w-4xl w-full">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-left">
              <Icon className="w-6 h-6 text-yellow-300 mb-2" />
              <div className="font-semibold">{label}</div>
              <div className="text-blue-200 text-sm">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}