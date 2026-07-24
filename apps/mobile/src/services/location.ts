import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type LocationResult =
  | { status: 'granted'; coords: Coordinates }
  | { status: 'denied' }
  | { status: 'error'; message: string };

export async function getCurrentCoordinates(): Promise<LocationResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { status: 'denied' };
    }
    const position = await Location.getCurrentPositionAsync({});
    return {
      status: 'granted',
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    };
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : String(e) };
  }
}
