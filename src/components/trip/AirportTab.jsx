import { Plane, Bus, Car, Clock, Euro, ChevronRight } from 'lucide-react';

const typeIcons = {
  'Mezzi pubblici': Bus,
  'Taxi': Car,
  'NCC': Car,
};

export default function AirportTab({ trip }) {
  if (!trip.arrival_airport) {
    return (
      <div className="text-center py-10">
        <Plane className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-700">Nessun trasferimento aeroporto configurato</h3>
        <p className="text-muted-foreground text-sm mt-1">Hai indicato di sapere già come raggiungere l'alloggio</p>
      </div>
    );
  }

  if (!trip.airport_transfer?.options?.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Le istruzioni di trasferimento verranno generate con l'itinerario
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 rounded-2xl p-4 flex items-center gap-3">
        <Plane className="w-5 h-5 text-indigo-600 shrink-0" />
        <div>
          <p className="font-semibold text-indigo-900">{trip.arrival_airport}</p>
          {trip.accommodation_name && (
            <p className="text-sm text-indigo-600">→ {trip.accommodation_name}</p>
          )}
          {trip.arrival_datetime && (
            <p className="text-sm text-indigo-500">Arrivo: {new Date(trip.arrival_datetime).toLocaleString('it-IT')}</p>
          )}
        </div>
      </div>

      {trip.airport_transfer.options.map((opt, i) => {
        const Icon = typeIcons[opt.type] || Plane;
        return (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{opt.type}</h3>
                <p className="text-sm text-muted-foreground">{opt.description}</p>
              </div>
            </div>

            <div className="flex gap-4 mb-4 text-sm">
              {opt.duration && (
                <span className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" /> {opt.duration}
                </span>
              )}
              {opt.cost && (
                <span className="flex items-center gap-1 text-gray-600">
                  <Euro className="w-4 h-4" /> {opt.cost}
                </span>
              )}
            </div>

            {opt.steps?.length > 0 && (
              <div className="space-y-2">
                {opt.steps.map((step, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {j + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}