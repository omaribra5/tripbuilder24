import { base44 } from '@/api/base44Client';

export async function generateTripWithAI(trip) {
  const days = Math.max(1, Math.round(
    (new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)
  ));

  const prompt = `
Sei un esperto pianificatore di viaggi. Crea un itinerario dettagliato per il seguente viaggio:

DESTINAZIONE: ${trip.destination}, ${trip.country || ''}
DATE: dal ${trip.start_date} al ${trip.end_date} (${days} giorni)
VIAGGIATORI: ${trip.travelers}
BUDGET: ${trip.budget}
INTERESSI: ${(trip.interests || []).join(', ')}
NOTE: ${trip.notes || 'nessuna'}

PREFERENZE ALIMENTARI:
- Intolleranze: ${(trip.food_intolerances || []).join(', ') || 'nessuna'}
- Cibi preferiti: ${trip.favorite_foods || 'nessuno specificato'}
- Cibi da evitare: ${trip.disliked_foods || 'nessuno specificato'}
- Orario pranzo preferito: ${trip.meal_time_preference || '13:00'}

ISTRUZIONI IMPORTANTI:
1. Per ogni giorno inserisci tutte le attrazioni principali con orari realistici e durata in minuti.
2. Inserisci un ristorante nel momento più vicino all'orario di pranzo preferito (${trip.meal_time_preference || '13:00'}), tenendo conto degli orari delle attrazioni precedenti.
3. Il ristorante deve essere vicino all'attrazione precedente o successiva, e deve rispettare intolleranze e preferenze.
4. Per ogni attività includi coordinate GPS (lat/lng) realistiche.
5. Il tipo (type) può essere: "attrazione", "ristorante", "museo", "parco", "shopping", "trasporto".
6. Per i ristoranti includi nel campo "tip" info su cucina, prezzo medio e perché è adatto all'utente.

${!trip.has_accommodation ? `
HOTEL: suggerisci 3 hotel adatti al budget "${trip.budget}" e ben posizionati rispetto all'itinerario. Includi perché sono consigliati e un link booking_url stile "https://www.booking.com/search.html?ss=NOME+HOTEL+${encodeURIComponent(trip.destination)}"
` : ''}

${trip.arrival_airport ? `
TRASFERIMENTO AEROPORTO: 
- Aeroporto: ${trip.arrival_airport}
- Alloggio: ${trip.accommodation_name || trip.destination}
- Preferenza: ${trip.airport_transfer_preference}
- Includi opzioni dettagliate con passi, durata e costo stimato.
` : ''}

Rispondi SOLO con il JSON richiesto, senza testo aggiuntivo.
`;

  const schema = {
    type: 'object',
    properties: {
      itinerary: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            day: { type: 'number' },
            date: { type: 'string' },
            title: { type: 'string' },
            activities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string' },
                  duration_minutes: { type: 'number' },
                  tip: { type: 'string' },
                  lat: { type: 'number' },
                  lng: { type: 'number' },
                  booking_url: { type: 'string' }
                }
              }
            }
          }
        }
      },
      hotel_suggestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            zone: { type: 'string' },
            price_range: { type: 'string' },
            booking_url: { type: 'string' },
            why: { type: 'string' }
          }
        }
      },
      airport_transfer: {
        type: 'object',
        properties: {
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                description: { type: 'string' },
                duration: { type: 'string' },
                cost: { type: 'string' },
                steps: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      }
    }
  };

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: schema,
    add_context_from_internet: true,
    model: 'gemini_3_flash'
  });

  return {
    itinerary: result.itinerary || [],
    hotel_suggestions: result.hotel_suggestions || [],
    airport_transfer: result.airport_transfer || null,
  };
}