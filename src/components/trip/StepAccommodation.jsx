import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hotel, CheckCircle2, XCircle, Bus, Plane } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

export default function StepAccommodation({ data, update, onNext }) {
  const { language } = useLanguage();

  const ChoiceBtn = ({ active, onClick, icon: Icon, label }) => (
    <button
      onClick={onClick}
      className={`flex-1 p-4 rounded-2xl border-2 text-center transition-all ${
        active
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
      }`}
    >
      <Icon className="w-7 h-7 mx-auto mb-2" />
      <div className="font-semibold text-sm">{label}</div>
    </button>
  );

  // Determine if we can proceed
  const canProceed =
    data.has_accommodation === false ||
    (data.has_accommodation === true &&
      (data.wants_transfer_info === false ||
        (data.wants_transfer_info === true && data.accommodation_name?.trim() && data.arrival_airport?.trim())));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{t(language, 'step4_title')}</h2>
        <p className="text-muted-foreground">{t(language, 'step4_subtitle')}</p>
      </div>

      {/* Q1: already have accommodation? */}
      <div className="flex gap-4">
        <ChoiceBtn
          active={data.has_accommodation === true}
          onClick={() => update({ has_accommodation: true, wants_transfer_info: null })}
          icon={CheckCircle2}
          label={t(language, 'step4_yes')}
        />
        <ChoiceBtn
          active={data.has_accommodation === false}
          onClick={() => update({ has_accommodation: false, wants_transfer_info: null, accommodation_name: '', arrival_airport: '' })}
          icon={XCircle}
          label={t(language, 'step4_no_know')}
        />
      </div>

      {/* Q2: if yes, do they want transit directions? */}
      {data.has_accommodation === true && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <p className="font-semibold text-gray-800 mb-3">{t(language, 'step4_transit_q')}</p>
            <div className="flex gap-4">
              <ChoiceBtn
                active={data.wants_transfer_info === true}
                onClick={() => update({ wants_transfer_info: true })}
                icon={Bus}
                label={t(language, 'step4_transit_yes')}
              />
              <ChoiceBtn
                active={data.wants_transfer_info === false}
                onClick={() => update({ wants_transfer_info: false, accommodation_name: '', arrival_airport: '' })}
                icon={XCircle}
                label={t(language, 'step4_transit_no')}
              />
            </div>
          </div>

          {/* Q3: hotel name + airport */}
          {data.wants_transfer_info === true && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <Label className="flex items-center gap-1.5 mb-1">
                  <Hotel className="w-4 h-4 text-indigo-500" />
                  {t(language, 'step4_hotel_label')}
                </Label>
                <Input
                  placeholder={t(language, 'step4_hotel_placeholder')}
                  value={data.accommodation_name || ''}
                  onChange={(e) => update({ accommodation_name: e.target.value })}
                />
              </div>
              <div>
                <Label className="flex items-center gap-1.5 mb-1">
                  <Plane className="w-4 h-4 text-indigo-500" />
                  {t(language, 'step4_airport_label')}
                </Label>
                <Input
                  placeholder={t(language, 'step4_airport_placeholder')}
                  value={data.arrival_airport || ''}
                  onChange={(e) => update({ arrival_airport: e.target.value })}
                />
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-sm text-sky-700">
                💡 {t(language, 'step4_transit_hint')}
              </div>
            </div>
          )}
        </div>
      )}

      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        onClick={onNext}
        disabled={!canProceed}
      >
        {t(language, 'continue')}
      </Button>
    </div>
  );
}