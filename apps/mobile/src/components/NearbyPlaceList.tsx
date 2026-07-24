import { StyleSheet, Text, View } from 'react-native';
import type { NearbyPlace, NearbyPlaceCategory } from '../domain/types';

const CATEGORY_LABEL: Record<NearbyPlaceCategory, string> = {
  convenience: '近くのコンビニ',
  supermarket: '近くのスーパー',
  restaurant: '近くの飲食店',
};

export function NearbyPlaceList({
  category,
  places,
}: {
  category: NearbyPlaceCategory;
  places: NearbyPlace[];
}) {
  if (places.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{CATEGORY_LABEL[category]}</Text>
      {places.map((place) => (
        <View key={place.id} style={styles.row}>
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.distance}>{formatDistance(place.distanceMeters)}</Text>
        </View>
      ))}
    </View>
  );
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  heading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  row: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  name: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 19,
  },
  distance: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});
