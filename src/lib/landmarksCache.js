import { base44 } from '@/api/base44Client';

const LANDMARKS_SCHEMA = {
  type: 'object',
  properties: {
    landmarks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          image_url: { type: 'string' },
          lat: { type: 'number' },
          lng: { type: 'number' },
        },
      },
    },
  },
};

export async function getLandmarksForCity(destination, country) {
  if (!destination) return [];

  const key = `${destination.toLowerCase().trim()}_${(country || '').toLowerCase().trim()}`;

  // 1. Check DB cache (TripTemplate reuse — look for a record with params_hash = key)
  try {
    const cached = await base44.entities.TripTemplate.filter({ params_hash: key }, '-created_date', 1);
    if (cached?.length && cached[0].landmarks?.length) {
      return cached[0].landmarks;
    }
  } catch (_) {}

  // 2. Call AI to get landmarks
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a travel expert. List the 12 most famous and must-see landmarks, monuments, and attractions in ${destination}, ${country || ''}. 
For each provide:
- name: the official name of the landmark
- description: 1-2 sentences about what it is and why it's special
- category: one of "monument", "museum", "church", "nature", "square", "palace", "bridge", "viewpoint", "market", "park"
- image_url: a real Unsplash image URL for this landmark (format: https://images.unsplash.com/photo-XXXXXXXXXX?w=400&h=280&fit=crop). Use a real and valid Unsplash photo URL that matches the landmark.
- lat: GPS latitude
- lng: GPS longitude
Return ONLY landmarks that are genuinely famous and recognizable. No generic places.`,
    response_json_schema: LANDMARKS_SCHEMA,
    add_context_from_internet: true,
    model: 'gemini_3_flash',
  });

  const landmarks = result?.landmarks || [];

  // 3. Save to cache
  if (landmarks.length) {
    try {
      base44.entities.TripTemplate.create({
        params_hash: key,
        destination,
        country: country || '',
        duration_days: 0,
        landmarks,
      });
    } catch (_) {}
  }

  return landmarks;
}