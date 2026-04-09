import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function numberedIcon(num, color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      color:white;
      width:30px;height:30px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      border:2px solid white;
    ">
      <span style="transform:rotate(45deg);font-size:12px;font-weight:bold;">${num}</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
  });
}

function FlyToCenter({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, 13, { duration: 0.8 }); }, [center]);
  return null;
}

export default function MapTab({ trip }) {
  const { language } = useLanguage();
  const days = trip.itinerary || [];
  const [selectedDay, setSelectedDay] = useState(days[0]?.day ?? null);

  const currentDay = days.find((d) => d.day === selectedDay);
  const activities = (currentDay?.activities || []).filter((a) => a.lat && a.lng);

  if (!days.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>{t(language, 'map_no_itinerary')}</p>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="space-y-3">
        <DaySelector days={days} selectedDay={selectedDay} onChange={setSelectedDay} language={language} />
        <div className="text-center py-10 text-muted-foreground">{t(language, 'map_no_coords')}</div>
      </div>
    );
  }

  const center = [activities[0].lat, activities[0].lng];
  const polylinePoints = activities.map((a) => [a.lat, a.lng]);

  return (
    <div className="space-y-3">
      <DaySelector days={days} selectedDay={selectedDay} onChange={setSelectedDay} language={language} />
      <div className="rounded-2xl overflow-hidden border shadow-sm">
        <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToCenter center={center} />
          <Polyline positions={polylinePoints} color="#6366f1" weight={2} dashArray="6" />
          {activities.map((act, i) => (
            <Marker
              key={i}
              position={[act.lat, act.lng]}
              icon={numberedIcon(i + 1, act.type === 'ristorante' ? '#f97316' : '#6366f1')}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-bold">{i + 1}. {act.time} — {act.name}</div>
                  {act.description && <p className="mt-1 text-gray-600">{act.description}</p>}
                  {act.tip && <p className="mt-1 text-amber-600">💡 {act.tip}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="p-3 bg-white flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> {t(language, 'map_legend_attractions')}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" /> {t(language, 'map_legend_restaurants')}</span>
        </div>
      </div>
    </div>
  );
}

function DaySelector({ days, selectedDay, onChange, language }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-semibold text-gray-700 shrink-0">{t(language, 'map_day_label')}:</label>
      <select
        className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white flex-1"
        value={selectedDay ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {days.map((d) => (
          <option key={d.day} value={d.day}>
            {t(language, 'map_day_label')} {d.day}{d.title ? ` — ${d.title}` : ''}{d.date ? ` (${d.date})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}