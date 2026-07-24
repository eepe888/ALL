import type { Coordinates } from './location';
import type { NearbyPlace, NearbyPlaceCategory } from '../domain/types';

// Overpass API（OpenStreetMap）で近隣のコンビニ・スーパー・飲食店を検索する。
// apps/web の CafeFinder（src/lib/overpass.ts）と同じ考え方の実装。
// Google Places APIと異なり秘密鍵が不要な公開APIのため、クライアントから直接呼び出せる。
// TODO(将来): 外食のジャンル・評価・口コミ要約が欲しくなったらGoogle Places API（New）に置き換える
// （要件定義書 6-2, 8-1 RestaurantRecommendationCache参照。有料・要バックエンドプロキシ）。

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
const SEARCH_RADIUS_METERS = 800; // 徒歩圏内の目安（徒歩10分 ≒ 800m）
const RESULTS_PER_CATEGORY = 6;

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

function buildQuery(lat: number, lon: number): string {
  const around = `around:${SEARCH_RADIUS_METERS},${lat},${lon}`;
  return `
    [out:json][timeout:25];
    (
      node["shop"="convenience"](${around});
      node["shop"="supermarket"](${around});
      way["shop"="supermarket"](${around});
      node["amenity"="restaurant"](${around});
      node["amenity"="fast_food"](${around});
      node["amenity"="cafe"](${around});
    );
    out center;
  `;
}

function categorize(tags: Record<string, string>): NearbyPlaceCategory | undefined {
  if (tags.shop === 'convenience') return 'convenience';
  if (tags.shop === 'supermarket') return 'supermarket';
  if (['restaurant', 'fast_food', 'cafe'].includes(tags.amenity ?? '')) return 'restaurant';
  return undefined;
}

// ハーバサイン公式で2点間の距離（メートル）を計算
function distanceMeters(a: Coordinates, b: Coordinates): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export async function fetchNearbyPlaces(origin: Coordinates): Promise<NearbyPlace[]> {
  const query = buildQuery(origin.latitude, origin.longitude);

  const response = await fetch(OVERPASS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Overpassは素性の分からないUser-Agentだと406を返すことがあるため付与する
      // （Webのfetchでは付与できないブラウザもあるが、その場合はブラウザの既定UAで代替される）
      'User-Agent': 'kibungohan-app/0.1 (personal project; contact: n/a)',
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data: OverpassResponse = await response.json();

  const places: NearbyPlace[] = data.elements
    .map((el) => {
      const tags = el.tags ?? {};
      const category = categorize(tags);
      const name = tags.name;
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (!category || !name || lat === undefined || lon === undefined) return undefined;

      const place: NearbyPlace = {
        id: `${el.type}/${el.id}`,
        category,
        name,
        distanceMeters: distanceMeters(origin, { latitude: lat, longitude: lon }),
        subLabel: tags.cuisine ?? tags.amenity ?? undefined,
      };
      return place;
    })
    .filter((p): p is NearbyPlace => p !== undefined)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return groupAndLimit(places);
}

function groupAndLimit(places: NearbyPlace[]): NearbyPlace[] {
  const categories: NearbyPlaceCategory[] = ['convenience', 'supermarket', 'restaurant'];
  return categories.flatMap((category) =>
    places.filter((p) => p.category === category).slice(0, RESULTS_PER_CATEGORY),
  );
}
