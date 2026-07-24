import { StyleSheet, Text, View } from 'react-native';
import type { RestaurantSuggestion } from '../domain/types';

export function RestaurantCard({ restaurant }: { restaurant: RestaurantSuggestion }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.rating}>★ {restaurant.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.meta}>
        {restaurant.genre} ・ {Math.round(restaurant.distanceMeters)}m
      </Text>
      <Text style={styles.reviewSummary}>{restaurant.reviewSummary}</Text>
      <Text style={styles.disclaimer}>※ 評価・口コミはGoogle Places API由来（モック表示）</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  rating: {
    fontSize: 14,
    color: '#b45309',
    fontWeight: '700',
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  reviewSummary: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 8,
  },
});
