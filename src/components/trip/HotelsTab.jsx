import { Hotel, MapPin, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HotelsTab({ trip }) {
  if (trip.has_accommodation) {
    return (
      <div className="text-center py-10">
        <Hotel className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-700">Hai già un alloggio prenotato</h3>
        {trip.accommodation_name && (
          <p className="text-muted-foreground mt-1">{trip.accommodation_name}</p>
        )}
      </div>
    );
  }

  if (!trip.hotel_suggestions?.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        I suggerimenti hotel verranno generati con l'itinerario
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Hotel selezionati in base alla posizione rispetto al tuo tour e al tuo budget <strong>{trip.budget}</strong>
      </p>
      {trip.hotel_suggestions.map((hotel, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <Hotel className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {hotel.zone}
                </div>
              </div>
            </div>
            {hotel.price_range && (
              <span className="text-sm font-semibold text-indigo-600 shrink-0">{hotel.price_range}</span>
            )}
          </div>

          {hotel.description && (
            <p className="text-sm text-gray-600 mt-3">{hotel.description}</p>
          )}

          {hotel.why && (
            <div className="mt-3 bg-indigo-50 rounded-xl px-3 py-2 text-sm text-indigo-700">
              💡 {hotel.why}
            </div>
          )}

          {hotel.booking_url && (
            <a href={hotel.booking_url} target="_blank" rel="noopener noreferrer" className="mt-4 block">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2">
                <ExternalLink className="w-4 h-4" />
                Cerca su Booking.com
              </Button>
            </a>
          )}
        </div>
      ))}
    </div>
  );
}