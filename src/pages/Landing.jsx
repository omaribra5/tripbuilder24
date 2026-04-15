import { Link } from 'react-router-dom';
import {
  MapPin, Utensils, Hotel, Plane, Headphones,
  FileText, Star, CheckCircle, ArrowRight, Smartphone, Globe,
  Zap, Shield, Clock, Users, Calendar, DollarSign
} from 'lucide-react';

const FEATURES = [
  {
    icon: MapPin,
    title: 'Itinerario AI Day-by-Day',
    desc: 'Piano giornaliero completo con orari, durate e consigli pratici — personalizzato su di te.',
    color: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  },
  {
    icon: Utensils,
    title: 'Ristoranti su Misura',
    desc: 'I migliori ristoranti lungo il percorso, rispettando le tue intolleranze e preferenze.',
    color: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  },
  {
    icon: Hotel,
    title: 'Hotel per Posizione',
    desc: 'Suggeriamo gli hotel in base alla vicinanza al tuo tour, con link diretto a Booking.com.',
    color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  },
  {
    icon: Plane,
    title: 'Trasferimento Aeroporto',
    desc: 'Istruzioni passo-passo con mezzi pubblici o taxi dall\'aeroporto al tuo alloggio.',
    color: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  },
  {
    icon: Headphones,
    title: 'Audio Tour AI',
    desc: 'Guida vocale interattiva che ti racconta storia e segreti di ogni luogo mentre sei lì.',
    color: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
  },
  {
    icon: DollarSign,
    title: 'Gestione Spese',
    desc: 'Traccia ogni spesa del viaggio per categoria, con budget e riepilogo in tempo reale.',
    color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  },
];

const STEPS = [
  { n: '01', title: 'Scegli la destinazione', desc: 'Dove vuoi andare, le date e con chi viaggi.' },
  { n: '02', title: 'Personalizza', desc: 'Interessi, budget, cibo, alloggio — tutto su misura.' },
  { n: '03', title: 'L\'AI genera il piano', desc: 'In secondi ricevi un itinerario completo e dettagliato.' },
  { n: '04', title: 'Viaggia e traccia', desc: 'Segna visite, aggiungi spese e consulta la guida AI live.' },
];

const TESTIMONIALS = [
  {
    name: 'Giulia R.',
    location: 'Milano',
    avatar: 'GR',
    text: 'Avevo paura di organizzare una settimana a Tokyo da sola. TripBuilder24 ha fatto tutto in 30 secondi. Perfetto!',
    stars: 5,
  },
  {
    name: 'Marco & Sofia',
    location: 'Roma',
    avatar: 'MS',
    text: 'L\'itinerario per Barcellona era così dettagliato che non abbiamo perso nemmeno un minuto. I ristoranti erano incredibili.',
    stars: 5,
  },
  {
    name: 'Luca F.',
    location: 'Torino',
    avatar: 'LF',
    text: 'Le istruzioni per l\'aeroporto ci hanno salvato all\'arrivo a Bangkok. Non avrei saputo come prendere i mezzi.',
    stars: 5,
  },
];

const STATS = [
  { value: '10.000+', label: 'Itinerari creati' },
  { value: '150+', label: 'Destinazioni' },
  { value: '4.9★', label: 'Valutazione media' },
  { value: '98%', label: 'Utenti soddisfatti' },
];

// Mockup screenshot cards that simulate app UI
const APP_SCREENSHOTS = [
  {
    bg: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
    label: 'Itinerario',
    items: ['09:00 — Sagrada Família', '12:30 — 🍽️ Bodega Sepúlveda', '15:00 — Park Güell', '20:00 — 🍽️ El Nacional'],
    color: 'from-indigo-600 to-indigo-900',
  },
  {
    bg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop',
    label: 'Ristoranti AI',
    items: ['⭐ 4.8 — Cervecería Catalana', '💰 €€ — Palo Cortao', '🌱 Vegano — Green Spot'],
    color: 'from-orange-600 to-orange-900',
  },
  {
    bg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop',
    label: 'Hotel',
    items: ['Hotel Arts ⭐⭐⭐⭐⭐', '10 min dal centro', '€180/notte · Booking.com →'],
    color: 'from-cyan-600 to-cyan-900',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img
            src="https://media.base44.com/images/public/69d2b459265164ba16bfc871/6c9d959b6_pikes_1776257498690.jpg"
            alt="TripBuilder24"
            className="h-9 w-auto object-contain"
          />
          <div className="flex items-center gap-3">
            <Link to="/app">
              <button className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2 font-medium">
                Accedi
              </button>
            </Link>
            <Link to="/app">
              <button className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/30">
                Inizia Gratis →
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-400/40 px-4 py-2 rounded-full mb-8">
              <Zap className="w-4 h-4" />
              Pianificazione viaggi potenziata dall'AI
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Il tuo viaggio perfetto,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400">
                generato in secondi
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              TripBuilder24 usa l'intelligenza artificiale per creare itinerari giornalieri personalizzati,
              suggerire ristoranti, hotel e trasferimenti — tutto in base a te.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link to="/app">
                <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base shadow-xl shadow-indigo-500/30">
                  <Globe className="w-5 h-5" />
                  Usa da Browser — Gratis
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <p className="text-sm text-slate-400 font-medium">Oppure scarica l'app:</p>
              <div className="flex gap-3">
                <a href="#" className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/15 transition-colors px-4 py-2.5 rounded-xl" onClick={(e) => e.preventDefault()}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-300 leading-none">Scarica su</div>
                    <div className="text-sm font-bold text-white">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/15 transition-colors px-4 py-2.5 rounded-xl" onClick={(e) => e.preventDefault()}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.65.19.96.07l12.12-6.97-2.59-2.59-10.49 9.49zM.4 1.81C.15 2.12 0 2.56 0 3.13v17.74c0 .57.15 1.01.4 1.32l.07.07L10.14 12.5v-.23L.47 1.74.4 1.81zM20.45 10.03l-2.53-1.45-2.84 2.84 2.84 2.84 2.56-1.47c.73-.42.73-1.34-.03-1.76zM3.18.24L15.3 7.21l-2.59 2.59L2.22.31c.3-.12.65-.1.96.07v-.14z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-300 leading-none">Disponibile su</div>
                    <div className="text-sm font-bold text-white">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* App screenshot mockups */}
          <div className="mt-20 flex gap-6 justify-center items-end overflow-x-auto pb-4">
            {APP_SCREENSHOTS.map((s, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-56 rounded-3xl overflow-hidden border border-white/15 shadow-2xl ${i === 1 ? 'scale-110 z-10' : 'opacity-80 scale-100'} transition-all`}
                style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
              >
                {/* Phone notch */}
                <div className="bg-slate-900 px-4 pt-3 pb-1 flex justify-center">
                  <div className="w-16 h-1.5 bg-white/20 rounded-full" />
                </div>
                {/* Header */}
                <div className={`bg-gradient-to-br ${s.color} px-4 py-3`}>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-0.5">TripBuilder24</div>
                  <div className="text-sm font-bold text-white">{s.label}</div>
                </div>
                {/* Background image */}
                <div className="relative h-28 overflow-hidden">
                  <img src={s.bg} alt={s.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
                {/* Content items */}
                <div className="bg-slate-900 px-3 py-3 space-y-2">
                  {s.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                      <span className="text-xs text-slate-200 leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
                {/* Bottom bar */}
                <div className="bg-slate-900 px-4 pb-4 pt-1 flex justify-center gap-4">
                  {['🗺️','🏨','✈️','💰'].map((icon, j) => (
                    <span key={j} className="text-base opacity-60">{icon}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 px-6 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-sm text-slate-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 bg-cyan-500/15 border border-cyan-400/40 px-4 py-2 rounded-full mb-4">
              <Clock className="w-4 h-4" />
              Pronto in meno di 2 minuti
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">Come funziona</h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">Quattro semplici passi per avere il tuo viaggio perfetto</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="relative bg-white/5 border border-white/12 rounded-2xl p-6 hover:border-indigo-400/50 hover:bg-white/8 transition-all">
                <div className="text-5xl font-black text-indigo-400/40 mb-3 leading-none">{step.n}</div>
                <h3 className="font-bold text-white mb-2 text-base">{step.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">Tutto quello che ti serve</h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">Da un'unica app gestisci ogni aspetto del tuo viaggio</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white/4 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/7 transition-all group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white mb-2 text-base">{f.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-pink-300 bg-pink-500/15 border border-pink-400/40 px-4 py-2 rounded-full mb-6">
                <Smartphone className="w-4 h-4" />
                Disponibile ovunque
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
                Con te in ogni momento del viaggio
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Consulta l'itinerario, segna le attrazioni visitate, tieni traccia delle spese
                e ascolta l'audio tour — anche senza connessione.
              </p>
              <div className="space-y-3">
                {[
                  'Funziona anche offline',
                  'Sincronizzazione su tutti i dispositivi',
                  'Nessuna pubblicità, nessuna distrazione',
                  'Export PDF del tuo itinerario',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=400&fit=crop', label: 'Itinerario AI', icon: '🗺️' },
                { img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=400&fit=crop', label: 'Mappe live', icon: '📍' },
                { img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=400&fit=crop', label: 'Ristoranti AI', icon: '🍽️' },
                { img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=400&fit=crop', label: 'Hotel', icon: '🏨' },
              ].map((item, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] group border border-white/10">
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm font-bold text-white">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-300 bg-yellow-500/15 border border-yellow-400/40 px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 fill-yellow-300" />
              Oltre 10.000 viaggiatori felici
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">Cosa dicono i nostri utenti</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/12 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Velocissimo', desc: 'In 2 minuti hai un itinerario completo per 7 giorni. Nessuna attesa, nessun compromesso.', color: 'text-yellow-400 bg-yellow-500/15 border-yellow-400/30' },
              { icon: Shield, title: 'Sicuro e Privato', desc: 'I tuoi dati e itinerari sono tuoi. Non vendiamo informazioni a nessuno.', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-400/30' },
              { icon: Users, title: 'Per Tutti', desc: 'Solo, coppia, famiglia o gruppo — TripBuilder24 si adatta a ogni tipo di viaggio.', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-400/30' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-white/4 border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-white text-lg mb-2">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-indigo-600/20 via-indigo-500/10 to-cyan-500/10 border border-indigo-400/30 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Pronto per il tuo prossimo viaggio?
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Gratis, senza carta di credito. Inizia adesso e scopri quanto è facile viaggiare con l'AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link to="/app">
                  <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-10 py-4 rounded-xl transition-colors text-base shadow-xl shadow-indigo-500/40">
                    <Globe className="w-5 h-5" />
                    Inizia da Browser — Gratis
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6">
                <a href="#" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors font-medium" onClick={(e) => e.preventDefault()}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  App Store
                </a>
                <span className="text-slate-600">·</span>
                <a href="#" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors font-medium" onClick={(e) => e.preventDefault()}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.65.19.96.07l12.12-6.97-2.59-2.59-10.49 9.49zM.4 1.81C.15 2.12 0 2.56 0 3.13v17.74c0 .57.15 1.01.4 1.32l.07.07L10.14 12.5v-.23L.47 1.74.4 1.81zM20.45 10.03l-2.53-1.45-2.84 2.84 2.84 2.84 2.56-1.47c.73-.42.73-1.34-.03-1.76zM3.18.24L15.3 7.21l-2.59 2.59L2.22.31c.3-.12.65-.1.96.07v-.14z"/></svg>
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src="https://media.base44.com/images/public/69d2b459265164ba16bfc871/6c9d959b6_pikes_1776257498690.jpg"
            alt="TripBuilder24"
            className="h-8 w-auto object-contain"
          />
          <p className="text-sm text-slate-500">© 2024 TripBuilder24. Tutti i diritti riservati.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Termini</a>
            <a href="#" className="hover:text-white transition-colors">Contatti</a>
          </div>
        </div>
      </footer>
    </div>
  );
}