import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plane } from 'lucide-react';
import Autocomplete from '@/components/ui/Autocomplete';
import { searchAirports } from '@/lib/airportData';

export default function StepAirport({ data, update, onGenerate }) {
  const [needsTransfer, setNeedsTransfer] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Trasferimento aeroporto</h2>
        <p className="text-muted-foreground">Hai bisogno di istruzioni per raggiungere l'alloggio dall'aeroporto?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setNeedsTransfer(true)}
          className={`p-4 rounded-2xl border-2 text-center transition-all ${
            needsTransfer === true
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
          }`}
        >
          <Plane className="w-8 h-8 mx-auto mb-2" />
          <div className="font-semibold">Sì, mi serve aiuto</div>
        </button>

        <button
          onClick={() => setNeedsTransfer(false)}
          className={`p-4 rounded-2xl border-2 text-center transition-all ${
            needsTransfer === false
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
          }`}
        >
          <div className="w-8 h-8 mx-auto mb-2 text-2xl">✓</div>
          <div className="font-semibold">No, so già come fare</div>
        </button>
      </div>

      {needsTransfer === true && (
        <div className="space-y-4">
          <div>
            <Label>Aeroporto di arrivo</Label>
            <Autocomplete
              className="mt-1"
              value={data.arrival_airport}
              onChange={(val) => update({ arrival_airport: val })}
              onSelect={(item) => update({ arrival_airport: `${item.name} (${item.code})` })}
              placeholder="es. El Prat, Fiumicino, CDG..."
              fetchSuggestions={async (q) => searchAirports(q)}
              renderItem={(item) => ({
                label: `${item.name} (${item.code})`,
                sublabel: `${item.city}, ${item.country}`,
              })}
            />
          </div>

          <div>
            <Label>Data e ora di arrivo</Label>
            <input
              type="datetime-local"
              className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={data.arrival_datetime}
              onChange={(e) => update({ arrival_datetime: e.target.value })}
            />
          </div>

          <div>
            <Label className="mb-2 block">Come preferisci spostarti?</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'pubblico', label: '🚌 Mezzi pubblici' },
                { value: 'taxi', label: '🚕 Taxi/NCC' },
                { value: 'entrambi', label: '🔀 Entrambe' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update({ airport_transfer_preference: value })}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    data.airport_transfer_preference === value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 text-lg rounded-2xl"
        onClick={onGenerate}
      >
        ✨ Genera il mio itinerario AI
      </Button>
    </div>
  );
}