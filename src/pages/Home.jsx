import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Mic, FileText, UtensilsCrossed, Hotel, Plane } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 text-white">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="mb-6 flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm backdrop-blur">
          <MapPin className="w-4 h-4 text-yellow-300" />
          <span>La tua guida turistica AI</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Viaggia<br />
          <span className="text-yellow-300">senza pensieri</span>
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mb-10">
          L'AI pianifica il tuo viaggio perfetto: itinerario, ristoranti, hotel, trasferimenti e audio tour — tutto su misura per te.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/new-trip">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 text-lg rounded-full">
              Pianifica il tuo viaggio
            </Button>
          </Link>
          <Link to="/my-trips">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full">
              I miei viaggi
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-20 max-w-4xl w-full">
          {[
            { icon: MapPin, label: 'Itinerario AI', desc: 'Personalizzato per te' },
            { icon: UtensilsCrossed, label: 'Ristoranti', desc: 'In base ai tuoi gusti' },
            { icon: Hotel, label: 'Hotel', desc: 'Consigliati per posizione' },
            { icon: Plane, label: 'Aeroporto → Hotel', desc: 'Come arrivare' },
            { icon: Mic, label: 'Audio Tour', desc: 'Guida vocale live' },
            { icon: FileText, label: 'Export PDF', desc: 'Itinerario stampabile' },
          ].map(({ icon: Icon, label, desc }) => (
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