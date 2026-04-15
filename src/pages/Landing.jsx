import { Link } from 'react-router-dom';
import {
  MapPin, Calendar, Utensils, Hotel, Plane, Headphones,
  FileText, Star, CheckCircle, ArrowRight, Smartphone, Globe,
  Zap, Shield, Clock, Users
} from 'lucide-react';

const FEATURES = [
  {
    icon: MapPin,
    title: 'Itinerario AI Day-by-Day',
    desc: 'L\'AI crea un piano giornaliero completo con orari, durate e consigli pratici personalizzati su di te.',
    color: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    icon: Utensils,
    title: 'Ristoranti su Misura',
    desc: 'Consigliamo i migliori ristoranti lungo il percorso rispettando le tue intolleranze e preferenze alimentari.',
    color: 'bg-orange-500/10 text-orange-400',
  },
  {
    icon: Hotel,
    title: 'Hotel per Posizione e Budget',
    desc: 'Suggeriamo gli hotel migliori in base alla vicinanza alle attrazioni del tuo tour, con link diretto a Booking.com.',
    color: 'bg-cyan-500/10 text-cyan-400',
  },
  {
    icon: Plane,
    title: 'Trasferimento Aeroporto',
    desc: 'Istruzioni dettagliate passo-passo con mezzi pubblici o taxi dall\'aeroporto al tuo alloggio e viceversa.',
    color: 'bg-violet-500/10 text-violet-400',
  },
  {
    icon: Headphones,
    title: 'Audio Tour AI',
    desc: 'Una guida vocale interattiva che ti racconta la storia e i segreti di ogni luogo mentre sei lì.',
    color: 'bg-pink-500/10 text-pink-400',
  },
  {
    icon: FileText,
    title: 'Export PDF & Documenti',
    desc: 'Esporta il tuo itinerario in PDF per averlo offline. Carica documenti di viaggio come biglietti e prenotazioni.',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
];

const STEPS = [
  { n: '01', title: 'Scegli la destinazione', desc: 'Inserisci dove vuoi andare, le date e con chi viaggi.' },
  { n: '02', title: 'Personalizza le preferenze', desc: 'Interessi, budget, cibo, alloggio — tutto su misura.' },
  { n: '03', title: 'L\'AI genera il piano', desc: 'In pochi secondi ricevi un itinerario completo e dettagliato.' },
  { n: '04', title: 'Viaggia e traccia tutto', desc: 'Segna le visite, aggiungi spese e consulta la guida AI.' },
];

const TESTIMONIALS = [
  {
    name: 'Giulia R.',
    location: 'Milano',
    text: 'Avevo paura di organizzare una settimana a Tokyo da sola. TripBuilder24 ha fatto tutto in 30 secondi. Perfetto!',
    stars: 5,
  },
  {
    name: 'Marco & Sofia',
    location: 'Roma',
    text: 'L\'itinerario per Barcellona era così dettagliato che non abbiamo perso nemmeno un minuto. I ristoranti consigliati erano incredibili.',
    stars: 5,
  },
  {
    name: 'Luca F.',
    location: 'Torino',
    text: 'Le istruzioni per l\'aeroporto ci hanno salvato all\'arrivo a Bangkok. Non avrei saputo come prendere i mezzi da solo.',
    stars: 5,
  },
];

const STATS = [
  { value: '10.000+', label: 'Itinerari creati' },
  { value: '150+', label: 'Destinazioni' },
  { value: '4.9★', label: 'Valutazione media' },
  { value: '98%', label: 'Utenti soddisfatti' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img
            src="https://media.base44.com/images/public/69d2b459265164ba16bfc871/6c9d959b6_pikes_1776257498690.jpg"
            alt="TripBuilder24"
            className="h-9 w-auto object-contain"
          />
          <div className="flex items-center gap-3">
            <Link to="/app">
              <button className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
                Accedi
              </button>
            </Link>
            <Link to="/app">
              <button className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg transition-colors">
                Inizia Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8">
            <Zap className="w-3.5 h-3.5" />
            Pianificazione viaggi potenziata dall'AI
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Il tuo viaggio perfetto,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              generato in secondi
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            TripBuilder24 usa l'intelligenza artificiale per creare itinerari giornalieri personalizzati, 
            suggerire ristoranti, hotel e trasferimenti — tutto in base a te.
          </p>

          {/* CTA principale */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/app">
              <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base shadow-lg shadow-indigo-500/25">
                <Globe className="w-5 h-5" />
                Usa da Browser — Gratis
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* App store badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-sm text-slate-500">Oppure scarica l'app:</p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors px-5 py-3 rounded-xl"
                onClick={(e) => e.preventDefault()}
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-slate-400">Scarica su</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors px-5 py-3 rounded-xl"
                onClick={(e) => e.preventDefault()}
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.65.19.96.07l12.12-6.97-2.59-2.59-10.49 9.49zM.4 1.81C.15 2.12 0 2.56 0 3.13v17.74c0 .57.15 1.01.4 1.32l.07.07L10.14 12.5v-.23L.47 1.74.4 1.81zM20.45 10.03l-2.53-1.45-2.84 2.84 2.84 2.84 2.56-1.47c.73-.42.73-1.34-.03-1.76zM3.18.24L15.3 7.21l-2.59 2.59L2.22.31c.3-.12.65-.1.96.07v-.14z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-slate-400">Disponibile su</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-4">
              <Clock className="w-3.5 h-3.5" />
              Pronto in meno di 2 minuti
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Come funziona</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Quattro semplici passi per avere il tuo viaggio perfetto</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-indigo-500/40 to-transparent z-0" />
                )}
                <div className="relative z-10 bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
                  <div className="text-5xl font-black text-indigo-500/20 mb-3">{step.n}</div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-slate-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Tutto quello che ti serve</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Da un'unica app gestisci ogni aspetto del tuo viaggio</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 hover:bg-white/5 transition-all">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCREENSHOT / VISUAL MOCKUP */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full mb-6">
                <Smartphone className="w-3.5 h-3.5" />
                Disponibile ovunque
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Con te in ogni momento del viaggio
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Consulta l'itinerario offline, segna le attrazioni visitate, tieni traccia delle spese 
                e ascolta l'audio tour direttamente dal tuo telefono — senza connessione internet.
              </p>
              <div className="space-y-3">
                {[
                  'Funziona anche offline',
                  'Aggiornamenti in tempo reale',
                  'Sincronizzazione su tutti i dispositivi',
                  'Nessuna pubblicità, nessuna distrazione',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=400&fit=crop', label: 'Itinerario AI' },
                { img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=400&fit=crop', label: 'Mappe interattive' },
                { img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=400&fit=crop', label: 'Ristoranti' },
                { img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=400&fit=crop', label: 'Hotel consigliati' },
              ].map((item, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] group">
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-xs font-semibold text-white">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-slate-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-4">
              <Star className="w-3.5 h-3.5" />
              Oltre 10.000 viaggiatori felici
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cosa dicono i nostri utenti</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.location}</div>
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
              { icon: Zap, title: 'Velocissimo', desc: 'In 2 minuti hai un itinerario completo per 7 giorni. Nessuna attesa, nessun compromesso.' },
              { icon: Shield, title: 'Sicuro e Privato', desc: 'I tuoi dati e itinerari sono tuoi. Non vendiamo informazioni a nessuno.' },
              { icon: Users, title: 'Per Tutti', desc: 'Solo, coppia, famiglia o gruppo — TripBuilder24 si adatta a ogni tipo di viaggio.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-white/3 border border-white/8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-3xl p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pronto a pianificare il tuo prossimo viaggio?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Gratis, senza carta di credito. Inizia adesso e scopri quanto è facile viaggiare con l'AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/app">
                <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base shadow-lg shadow-indigo-500/25">
                  <Globe className="w-5 h-5" />
                  Inizia da Browser — Gratis
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6">
              <a href="#" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.65.19.96.07l12.12-6.97-2.59-2.59-10.49 9.49zM.4 1.81C.15 2.12 0 2.56 0 3.13v17.74c0 .57.15 1.01.4 1.32l.07.07L10.14 12.5v-.23L.47 1.74.4 1.81zM20.45 10.03l-2.53-1.45-2.84 2.84 2.84 2.84 2.56-1.47c.73-.42.73-1.34-.03-1.76zM3.18.24L15.3 7.21l-2.59 2.59L2.22.31c.3-.12.65-.1.96.07v-.14z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src="https://media.base44.com/images/public/69d2b459265164ba16bfc871/6c9d959b6_pikes_1776257498690.jpg"
            alt="TripBuilder24"
            className="h-8 w-auto object-contain"
          />
          <p className="text-sm text-slate-500">© 2024 TripBuilder24. Tutti i diritti riservati.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Termini</a>
            <a href="#" className="hover:text-white transition-colors">Contatti</a>
          </div>
        </div>
      </footer>
    </div>
  );
}