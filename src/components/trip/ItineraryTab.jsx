import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Utensils, ShoppingBag, TreePine, Building2 } from 'lucide-react';

const typeConfig = {
  ristorante: { icon: Utensils, color: 'bg-orange-100 text-orange-700', badge: 'Ristorante' },
  museo: { icon: Building2, color: 'bg-purple-100 text-purple-700', badge: 'Museo' },
  parco: { icon: TreePine, color: 'bg-green-100 text-green-700', badge: 'Parco' },
  shopping: { icon: ShoppingBag, color: 'bg-pink-100 text-pink-700', badge: 'Shopping' },
  attrazione: { icon: MapPin, color: 'bg-blue-100 text-blue-700', badge: 'Attrazione' },
  trasporto: { icon: Clock, color: 'bg-gray-100 text-gray-700', badge: 'Trasporto' },
};

export default function ItineraryTab({ trip }) {
  if (!trip.itinerary?.length) {
    return <div className="text-center py-10 text-muted-foreground">Itinerario non ancora generato</div>;
  }

  return (
    <div className="space-y-8">
      {trip.itinerary.map((day) => (
        <div key={day.day}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
              {day.day}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{day.title}</h3>
              {day.date && <p className="text-sm text-muted-foreground">{day.date}</p>}
            </div>
          </div>

          <div className="space-y-3 ml-4 pl-6 border-l-2 border-indigo-100">
            {(day.activities || []).map((act, i) => {
              const config = typeConfig[act.type] || typeConfig.attrazione;
              const Icon = config.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${config.color} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-indigo-600">{act.time}</span>
                        <h4 className="font-semibold text-gray-900">{act.name}</h4>
                        <Badge variant="secondary" className={config.color}>{config.badge}</Badge>
                      </div>
                      {act.description && (
                        <p className="text-sm text-muted-foreground mt-1">{act.description}</p>
                      )}
                      {act.duration_minutes && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {act.duration_minutes} min
                        </p>
                      )}
                      {act.tip && (
                        <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
                          💡 {act.tip}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}