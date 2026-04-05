import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const attractionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

export default function MapTab({ trip }) {
  const allActivities = (trip.itinerary || []).flatMap((d) =>
    (d.activities || []).filter((a) => a.lat && a.lng)
  );

  if (!allActivities.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>La mappa sarà disponibile dopo la generazione dell'itinerario</p>
      </div>
    );
  }

  const center = [allActivities[0].lat, allActivities[0].lng];
  const polylinePoints = allActivities.map((a) => [a.lat, a.lng]);

  return (
    <div className="rounded-2xl overflow-hidden border shadow-sm">
      <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={polylinePoints} color="#6366f1" weight={2} dashArray="6" />
        {allActivities.map((act, i) => (
          <Marker
            key={i}
            position={[act.lat, act.lng]}
            icon={act.type === 'ristorante' ? restaurantIcon : attractionIcon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold">{act.time} — {act.name}</div>
                {act.description && <p className="mt-1 text-gray-600">{act.description}</p>}
                {act.tip && <p className="mt-1 text-amber-600">💡 {act.tip}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="p-3 bg-white flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Attrazioni</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" /> Ristoranti</span>
      </div>
    </div>
  );
}