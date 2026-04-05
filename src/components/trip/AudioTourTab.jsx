import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, Square, SkipForward, Volume2 } from 'lucide-react';

export default function AudioTourTab({ trip }) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef(null);

  const allActivities = (trip.itinerary || []).flatMap((d) =>
    (d.activities || []).map((a) => ({ ...a, dayTitle: d.title, day: d.day }))
  );

  const currentActivity = allActivities[currentActivityIndex];

  const buildSpeechText = (act) => {
    let text = `${act.name}. `;
    if (act.description) text += act.description + '. ';
    if (act.tip) text += 'Consiglio: ' + act.tip + '. ';
    if (act.duration_minutes) text += `La visita dura circa ${act.duration_minutes} minuti. `;
    return text;
  };

  const speak = (act) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = buildSpeechText(act);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const next = () => {
    stop();
    const nextIndex = Math.min(currentActivityIndex + 1, allActivities.length - 1);
    setCurrentActivityIndex(nextIndex);
  };

  const selectActivity = (index) => {
    stop();
    setCurrentActivityIndex(index);
  };

  if (!allActivities.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        L'audio tour sarà disponibile dopo la generazione dell'itinerario
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Activity Card */}
      {currentActivity && (
        <div className="bg-gradient-to-br from-indigo-600 to-sky-600 rounded-3xl p-6 text-white">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-3">
            <Volume2 className="w-4 h-4" />
            Giorno {currentActivity.day} · {currentActivity.dayTitle}
          </div>
          <h2 className="text-2xl font-bold mb-1">{currentActivity.name}</h2>
          <p className="text-indigo-100 text-sm mb-1">{currentActivity.time}</p>
          {currentActivity.description && (
            <p className="text-indigo-100 text-sm mt-3 leading-relaxed">{currentActivity.description}</p>
          )}
          {currentActivity.tip && (
            <div className="mt-4 bg-white/10 rounded-xl p-3 text-sm">
              💡 {currentActivity.tip}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3 mt-6">
            {isPlaying ? (
              <Button onClick={stop} className="bg-white text-indigo-700 hover:bg-indigo-50 gap-2 rounded-full px-6">
                <Square className="w-4 h-4" /> Ferma
              </Button>
            ) : (
              <Button onClick={() => speak(currentActivity)} className="bg-white text-indigo-700 hover:bg-indigo-50 gap-2 rounded-full px-6">
                <Play className="w-4 h-4" /> Ascolta
              </Button>
            )}
            {currentActivityIndex < allActivities.length - 1 && (
              <Button onClick={next} variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 rounded-full">
                <SkipForward className="w-4 h-4" /> Prossima
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Activity List */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Tutte le tappe</h3>
        <div className="space-y-2">
          {allActivities.map((act, i) => (
            <button
              key={i}
              onClick={() => selectActivity(i)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                i === currentActivityIndex
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${i === currentActivityIndex ? 'text-indigo-200' : 'text-indigo-600'}`}>
                  {act.time}
                </span>
                <span className="font-medium">{act.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}