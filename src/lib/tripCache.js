import { base44 } from '@/api/base44Client';

/**
 * Creates a deterministic hash string from trip parameters.
 * Parameters that matter for generation: destination, country, duration, travelers, budget, interests (sorted), food prefs.
 */
export function buildParamsHash(trip) {
  const days = Math.max(1, Math.round(
    (new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)
  ));
  const parts = [
    (trip.destination || '').toLowerCase().trim(),
    (trip.country || '').toLowerCase().trim(),
    String(days),
    trip.travelers || '',
    trip.budget || '',
    [...(trip.interests || [])].sort().join(','),
    [...(trip.food_intolerances || [])].sort().join(','),
    (trip.favorite_foods || '').toLowerCase().trim(),
    (trip.disliked_foods || '').toLowerCase().trim(),
    (trip.meal_time_preference || '13:00'),
  ];
  return parts.join('|');
}

/**
 * Computes a similarity score [0-1] between two trips (ignoring dates).
 * 1 = identical parameters, 0 = completely different.
 */
function similarity(trip, template) {
  let score = 0;
  const total = 5;

  // Destination (most important) — 2 points
  if ((trip.destination || '').toLowerCase().trim() === (template.destination || '').toLowerCase().trim()) {
    score += 2;
  }

  // Duration within ±1 day — 1 point
  const days = Math.max(1, Math.round(
    (new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)
  ));
  if (Math.abs(days - (template.duration_days || 0)) <= 1) score += 1;

  // Travelers — 0.5 points
  if (trip.travelers === template.travelers) score += 0.5;

  // Budget — 0.5 points
  if (trip.budget === template.budget) score += 0.5;

  // Interests overlap — 1 point (proportional)
  const tripInterests = new Set((trip.interests || []).map(i => i.toLowerCase()));
  const tplInterests = new Set((template.interests || []).map(i => i.toLowerCase()));
  if (tripInterests.size > 0 && tplInterests.size > 0) {
    const intersection = [...tripInterests].filter(i => tplInterests.has(i)).length;
    const union = new Set([...tripInterests, ...tplInterests]).size;
    score += (intersection / union);
  }

  return score / (total);
}

/**
 * Tries to find a matching cached template.
 * Returns { match: 'exact'|'similar'|null, template }
 */
export async function findCachedTrip(trip) {
  const hash = buildParamsHash(trip);

  // 1. Exact match
  const exact = await base44.entities.TripTemplate.filter({ params_hash: hash });
  if (exact?.length > 0) {
    // Increment use count (fire and forget)
    base44.entities.TripTemplate.update(exact[0].id, { use_count: (exact[0].use_count || 1) + 1 });
    return { match: 'exact', template: exact[0] };
  }

  // 2. Similar match — fetch templates for same destination
  const candidates = await base44.entities.TripTemplate.filter(
    { destination: trip.destination },
    '-use_count',
    10
  );

  if (!candidates?.length) return { match: null, template: null };

  // Score all candidates
  const scored = candidates
    .map(tpl => ({ tpl, score: similarity(trip, tpl) }))
    .sort((a, b) => b.score - a.score);

  // Accept if similarity >= 0.6
  if (scored[0].score >= 0.6) {
    return { match: 'similar', template: scored[0].tpl, score: scored[0].score };
  }

  return { match: null, template: null };
}

/**
 * Saves a newly generated trip result as a template for future reuse.
 */
export async function saveTripTemplate(trip, result) {
  const hash = buildParamsHash(trip);
  const days = Math.max(1, Math.round(
    (new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)
  ));

  // Avoid duplicates (race condition guard)
  const existing = await base44.entities.TripTemplate.filter({ params_hash: hash });
  if (existing?.length > 0) return;

  await base44.entities.TripTemplate.create({
    params_hash: hash,
    destination: trip.destination,
    country: trip.country || '',
    travelers: trip.travelers,
    budget: trip.budget,
    duration_days: days,
    interests: trip.interests || [],
    itinerary: result.itinerary || [],
    hotel_suggestions: result.hotel_suggestions || [],
    use_count: 1,
  });
}