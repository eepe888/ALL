export interface Cafe {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  distanceMeters: number;
  isChain: boolean;
}

// Favorites are saved without distanceMeters since that's only meaningful
// relative to the search origin at the time, which changes as the user moves.
export type FavoriteCafe = Omit<Cafe, "distanceMeters">;
