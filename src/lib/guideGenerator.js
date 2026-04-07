import { base44 } from '@/api/base44Client';

const GUIDABLE_TYPES = ['museo', 'parco', 'attrazione'];

export function isGuidable(activity) {
  return GUIDABLE_TYPES.includes(activity.type);
}

export async function generateActivityGuide(activity, tripDestination) {
  const prompt = `
Sei una guida turistica esperta e appassionata. Crea una guida dettagliata e coinvolgente per visitare "${activity.name}" a ${tripDestination}.

La guida deve:
1. Iniziare con una breve introduzione storica/culturale emozionante (3-4 frasi)
2. Descrivere il percorso di visita passo per passo, come se stessi camminando con il turista. Sii specifico: dove andare, cosa guardare, cosa non perdere.
3. Includere 4-6 punti di interesse interni/esterni con descrizioni dettagliate e curiosità uniche
4. Aggiungere consigli pratici (orari migliori, cosa portare, come evitare le code, ecc.)
5. Concludere con un consiglio speciale o un segreto da insider

Scrivi in modo vivace, personale e coinvolgente, come una vera guida turistica.
Usa emoji sparingly per rendere il testo più leggibile.
Lunghezza: dettagliata ma non eccessiva (circa 600-800 parole totali).

Rispondi SOLO con il JSON richiesto.
`;

  const schema = {
    type: 'object',
    properties: {
      introduction: { type: 'string' },
      visit_steps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            step_number: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            tip: { type: 'string' }
          }
        }
      },
      practical_info: {
        type: 'object',
        properties: {
          best_time: { type: 'string' },
          duration: { type: 'string' },
          price: { type: 'string' },
          tips: { type: 'array', items: { type: 'string' } }
        }
      },
      insider_secret: { type: 'string' },
      photo_url: { type: 'string' }
    }
  };

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: schema,
    add_context_from_internet: true,
    model: 'gemini_3_flash'
  });

  return result;
}

export async function generateDayGuides(trip, dayNumber) {
  const guides = {};
  const day = (trip.itinerary || []).find((d) => d.day === dayNumber);
  if (!day) return guides;

  for (const activity of (day.activities || [])) {
    if (isGuidable(activity)) {
      const guide = await generateActivityGuide(activity, trip.destination);
      guides[activity.name] = guide;
    }
  }

  return guides;
}