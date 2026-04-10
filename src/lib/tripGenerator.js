import { base44 } from '@/api/base44Client';
import { findCachedTrip, saveTripTemplate } from '@/lib/tripCache';

const LANGUAGE_NAMES = {
  it: 'Italian', en: 'English', fr: 'French', de: 'German',
  es: 'Spanish', pt: 'Portuguese', ja: 'Japanese', zh: 'Chinese',
  ar: 'Arabic', ru: 'Russian',
};

const RESPONSE_SCHEMA = {
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

function buildBasePrompt(trip, days, langName) {
  return `
You are an expert travel planner. Create a detailed itinerary for the following trip.
IMPORTANT: Write ALL text content (titles, descriptions, tips, names of activities, restaurant names, etc.) in ${langName}. Only proper nouns (e.g. famous landmark names) can remain in their original language.

DESTINATION: ${trip.destination}, ${trip.country || ''}
DATES: from ${trip.start_date} to ${trip.end_date} (${days} days)
TRAVELERS: ${trip.travelers}
BUDGET: ${trip.budget}
INTERESTS: ${(trip.interests || []).join(', ')}
NOTES: ${trip.notes || 'none'}

FOOD PREFERENCES:
- Intolerances: ${(trip.food_intolerances || []).join(', ') || 'none'}
- Favorite foods: ${trip.favorite_foods || 'not specified'}
- Foods to avoid: ${trip.disliked_foods || 'not specified'}
- Preferred lunch time: ${trip.meal_time_preference || '13:00'}

IMPORTANT INSTRUCTIONS:
1. For each day include all major attractions with realistic times and duration in minutes.
2. Include a restaurant at the time closest to the preferred lunch time (${trip.meal_time_preference || '13:00'}), considering the previous attraction schedules.
3. The restaurant must be near the previous or next attraction and respect intolerances and preferences.
4. For each activity include realistic GPS coordinates (lat/lng).
5. The type field can be: "attrazione", "ristorante", "museo", "parco", "shopping", "trasporto".
6. For restaurants include in the "tip" field info about cuisine, average price and why it's suitable.
7. VERY IMPORTANT - BOOKING URL: For EVERY bookable activity search the best specific operator online. Use GetYourGuide, Viator, Airbnb Experiences or the official site. Never leave booking_url empty for a bookable experience.
8. For restaurants use a TripAdvisor or Google Maps link in booking_url.
9. Activity names must be SPECIFIC: not "Boat trip" but "Sailing trip with snorkeling with [Operator Name]".

${!trip.has_accommodation ? `
HOTELS: suggest 3 hotels suitable for "${trip.budget}" budget, well located. Include why recommended and a booking_url like "https://www.booking.com/search.html?ss=HOTEL+NAME+${encodeURIComponent(trip.destination)}"
` : ''}

${trip.wants_transfer_info && trip.arrival_airport ? `
AIRPORT TRANSFER CARDS:
The user wants to know how to reach their hotel from the airport using public transport (and possibly taxi).
- Arrival airport: ${trip.arrival_airport}
- Hotel/Accommodation: ${trip.accommodation_name}
- Destination city: ${trip.destination}

You MUST include two special activities in the itinerary:
1. At the VERY START of Day 1 (before any other activity), add an activity with:
   - name: "🛬 ${trip.arrival_airport} → ${trip.accommodation_name}"
   - type: "trasporto"
   - time: "Arrivo"
   - description: step-by-step public transport instructions from ${trip.arrival_airport} to ${trip.accommodation_name} (lines, stops, transfers, walking)
   - tip: estimated total duration and cost range
   - lat/lng: coordinates of the airport

2. At the VERY END of the LAST day (after all other activities), add an activity with:
   - name: "🛫 ${trip.accommodation_name} → ${trip.arrival_airport}"
   - type: "trasporto"
   - time: "Partenza"
   - description: step-by-step public transport instructions from ${trip.accommodation_name} to ${trip.arrival_airport} (lines, stops, transfers, walking)
   - tip: recommended departure time and estimated total duration
   - lat/lng: coordinates of the airport

Be VERY specific: name real metro/bus/train lines, real stop names, real journey times per leg.
` : ''}

Respond ONLY with the required JSON, no additional text.
`;
}

function buildDeltaPrompt(trip, days, langName, template) {
  const templateDays = template.duration_days || days;

  // Compute human-readable diffs
  const diffs = [];

  if (trip.travelers !== template.travelers) {
    diffs.push(`travelers: from "${template.travelers}" to "${trip.travelers}"`);
  }

  const budgetOrder = { economico: 1, medio: 2, lusso: 3 };
  if (trip.budget !== template.budget) {
    const direction = (budgetOrder[trip.budget] || 2) > (budgetOrder[template.budget] || 2) ? 'higher' : 'lower';
    diffs.push(`budget: from "${template.budget}" to "${trip.budget}" (${direction})`);
  }

  if (Math.abs(days - templateDays) > 0) {
    const direction = days > templateDays ? `${days - templateDays} more day(s)` : `${templateDays - days} fewer day(s)`;
    diffs.push(`duration: from ${templateDays} to ${days} days (${direction})`);
  }

  const tripInterests = (trip.interests || []).map(i => i.toLowerCase());
  const tplInterests = (template.interests || []).map(i => i.toLowerCase());
  const addedInterests = tripInterests.filter(i => !tplInterests.includes(i));
  const removedInterests = tplInterests.filter(i => !tripInterests.includes(i));
  if (addedInterests.length) diffs.push(`new interests added: ${addedInterests.join(', ')}`);
  if (removedInterests.length) diffs.push(`interests removed: ${removedInterests.join(', ')}`);

  const tripIntolerances = (trip.food_intolerances || []).join(', ');
  const tplIntolerances = (template.food_intolerances || []).join(', ');
  if (tripIntolerances !== tplIntolerances) {
    diffs.push(`food intolerances changed to: ${tripIntolerances || 'none'}`);
  }

  if ((trip.meal_time_preference || '13:00') !== (template.meal_time_preference || '13:00')) {
    diffs.push(`preferred lunch time changed to: ${trip.meal_time_preference}`);
  }

  // Build natural-language adaptation sentence
  const adaptationSentence = diffs.length > 0
    ? `Adapt this itinerary with the following changes: ${diffs.join('; ')}.`
    : 'The parameters are very similar — mainly update the dates.';

  const templateItinerary = JSON.stringify(template.itinerary || []);

  return `
You are an expert travel planner. You have an existing itinerary as a base and must adapt it for a new traveler.
IMPORTANT: Write ALL text content in ${langName}.

${adaptationSentence}

BASE ITINERARY (use this as a starting point — reuse activities, GPS coordinates, and booking URLs where they still fit):
${templateItinerary}

NEW TRIP DETAILS:
DESTINATION: ${trip.destination}, ${trip.country || ''}
DATES: from ${trip.start_date} to ${trip.end_date} (${days} days)
TRAVELERS: ${trip.travelers}
BUDGET: ${trip.budget}
INTERESTS: ${(trip.interests || []).join(', ')}
NOTES: ${trip.notes || 'none'}

FOOD PREFERENCES:
- Intolerances: ${(trip.food_intolerances || []).join(', ') || 'none'}
- Favorite foods: ${trip.favorite_foods || 'not specified'}
- Foods to avoid: ${trip.disliked_foods || 'not specified'}
- Preferred lunch time: ${trip.meal_time_preference || '13:00'}

ADAPTATION RULES:
1. Keep all activities that are still compatible with the new parameters.
2. Replace only what conflicts with the changed parameters (budget, travelers type, interests, food).
3. If travelers changed (e.g. solo → group of friends), replace romantic/solo activities with group-friendly ones; adjust restaurant choices and atmosphere accordingly.
4. If budget changed, upgrade or downgrade hotels, restaurants and paid experiences proportionally.
5. If duration changed, add or remove days from the end.
6. Update ALL dates to match the new trip dates (${trip.start_date} to ${trip.end_date}).
7. Keep activity names specific (include operator names, etc.).
8. Keep existing booking_url values where activities are reused.

${!trip.has_accommodation ? `
HOTELS: suggest 3 hotels for "${trip.budget}" budget. Reuse base suggestions if they still fit the new budget, otherwise replace.
` : ''}

${trip.wants_transfer_info && trip.arrival_airport ? `
Add airport transfer activities:
- Start of Day 1: "🛬 ${trip.arrival_airport} → ${trip.accommodation_name}" (type: trasporto, step-by-step public transport)
- End of last day: "🛫 ${trip.accommodation_name} → ${trip.arrival_airport}" (type: trasporto, step-by-step return)
` : ''}

Respond ONLY with the required JSON, no additional text.
`;
}

export async function generateTripWithAI(trip, language = 'it') {
  const days = Math.max(1, Math.round(
    (new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)
  ));
  const langName = LANGUAGE_NAMES[language] || 'Italian';

  // --- Cache lookup ---
  const { match, template } = await findCachedTrip(trip);

  if (match === 'exact') {
    // Perfect cache hit — adapt dates only, no AI call needed
    const itinerary = (template.itinerary || []).map((day, i) => {
      const date = new Date(trip.start_date);
      date.setDate(date.getDate() + i);
      return { ...day, day: i + 1, date: date.toISOString().split('T')[0] };
    });
    return {
      itinerary,
      hotel_suggestions: template.hotel_suggestions || [],
      airport_transfer: null,
    };
  }

  // Build prompt: delta (with base context) or full
  const prompt = match === 'similar'
    ? buildDeltaPrompt(trip, days, langName, template)
    : buildBasePrompt(trip, days, langName);

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: RESPONSE_SCHEMA,
    add_context_from_internet: true,
    model: 'gemini_3_flash'
  });

  const output = {
    itinerary: result.itinerary || [],
    hotel_suggestions: result.hotel_suggestions || [],
    airport_transfer: result.airport_transfer || null,
  };

  // Save to cache for future reuse (fire and forget)
  saveTripTemplate(trip, output);

  return output;
}