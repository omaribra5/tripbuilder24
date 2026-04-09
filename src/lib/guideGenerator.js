import { base44 } from '@/api/base44Client';

const GUIDABLE_TYPES = ['museo', 'parco', 'attrazione'];

export function isGuidable(activity) {
  return GUIDABLE_TYPES.includes(activity.type);
}

const LANGUAGE_NAMES = {
  it: 'Italian', en: 'English', fr: 'French', de: 'German',
  es: 'Spanish', pt: 'Portuguese', ja: 'Japanese', zh: 'Chinese',
  ar: 'Arabic', ru: 'Russian',
};

export async function generateActivityGuide(activity, tripDestination, language = 'it') {
  const langName = LANGUAGE_NAMES[language] || 'Italian';
  const prompt = `
You are an expert and passionate tour guide. Create a detailed and engaging guide to visit "${activity.name}" in ${tripDestination}.
IMPORTANT: Write ALL content in ${langName}.

The guide must:
1. Start with a brief exciting historical/cultural introduction (3-4 sentences)
2. Describe the visit route step by step, as if walking with the tourist. Be specific: where to go, what to look at, what not to miss.
3. Include 4-6 points of interest with detailed descriptions and unique curiosities
4. Add practical tips (best times, what to bring, how to avoid queues, etc.)
5. End with a special insider tip or secret

IMPORTANT for photos: for each visit step, include a "photo_url" field with a real, publicly accessible photo URL from Wikimedia Commons (https://upload.wikimedia.org/...) or similar. Photos must be specific to that element. Also include a main photo_url for the whole attraction.

Write in a lively, personal and engaging style like a real tour guide.
Use emoji sparingly for readability.
Length: detailed but not excessive (about 600-800 words total).

Respond ONLY with the required JSON.
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
            tip: { type: 'string' },
            photo_url: { type: 'string', description: 'A real, publicly accessible photo URL (Wikimedia Commons or similar) showing this specific spot/element' }
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

export async function generateAlternativeActivity(activity, day, trip, language = 'it') {
  const langName = LANGUAGE_NAMES[language] || 'Italian';
  const otherActivities = (day.activities || [])
    .filter((a) => a.name !== activity.name)
    .map((a) => `- ${a.time} ${a.name} (${a.type})`)
    .join('\n');

  const prompt = `
You are a travel expert. The user is visiting ${trip.destination} and wants to replace this activity:
- Time: ${activity.time}
- Name: ${activity.name}
- Type: ${activity.type}
- Description: ${activity.description || ''}

Other activities that day (do not repeat these or suggest places far from them):
${otherActivities}

Suggest ONE ALTERNATIVE of the same type (${activity.type}) for the same time (${activity.time}), in the same neighborhood, that fits well with the rest of the day route.
IMPORTANT: Write all text content in ${langName}.

Respond ONLY with the required JSON.
`;

  const schema = {
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

export async function generateDayGuides(trip, dayNumber, language = 'it') {
  const guides = {};
  const day = (trip.itinerary || []).find((d) => d.day === dayNumber);
  if (!day) return guides;

  for (const activity of (day.activities || [])) {
    if (isGuidable(activity)) {
      const guide = await generateActivityGuide(activity, trip.destination, language);
      guides[activity.name] = guide;
    }
  }

  return guides;
}