import { haversineDistance } from "./geo";
import type { Cafe } from "@/types/cafe";

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

interface OverpassElement {
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

function buildQuery(lat: number, lon: number, radiusMeters: number): string {
  return `
    [out:json][timeout:25];
    (
      node["amenity"="cafe"](around:${radiusMeters},${lat},${lon});
      node["shop"="coffee"](around:${radiusMeters},${lat},${lon});
    );
    out body;
  `;
}

function formatAddress(tags: Record<string, string>): string | undefined {
  const parts = [tags["addr:city"], tags["addr:street"], tags["addr:housenumber"]].filter(
    Boolean
  );
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export async function fetchNearbyCafes(
  lat: number,
  lon: number,
  radiusMeters: number
): Promise<Cafe[]> {
  const query = buildQuery(lat, lon, radiusMeters);

  const response = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // Overpass's fair-use policy asks clients to identify themselves;
      // requests without a descriptive User-Agent are also rejected with
      // a 406 by its server.
      "User-Agent": "cafe-finder-app/1.0 (personal project; contact via app owner)",
    },
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data = (await response.json()) as OverpassResponse;
  const origin = { lat, lon };

  return data.elements
    .filter((el) => el.tags?.name)
    .map((el) => ({
      id: String(el.id),
      name: el.tags!.name,
      lat: el.lat,
      lon: el.lon,
      address: formatAddress(el.tags!),
      distanceMeters: Math.round(
        haversineDistance(origin, { lat: el.lat, lon: el.lon })
      ),
      // OSM tags a POI with `brand` (and usually `brand:wikidata`) when it
      // belongs to a chain; independent shops leave both untagged.
      isChain: Boolean(el.tags!.brand || el.tags!["brand:wikidata"]),
    }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}
