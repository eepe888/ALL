import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NearbyPlaceList } from '../src/components/NearbyPlaceList';
import { RestaurantCard } from '../src/components/RestaurantCard';
import { SuggestionCard } from '../src/components/SuggestionCard';
import { getCurrentCoordinates } from '../src/services/location';
import { classifyMood } from '../src/services/moodClassifier';
import { fetchNearbyPlaces } from '../src/services/nearbyPlaces';
import { buildSuggestions } from '../src/services/suggestionEngine';
import type {
  CategorySuggestion,
  NearbyPlace,
  RecipeSuggestion,
  RestaurantSuggestion,
  StaplePreference,
} from '../src/domain/types';

const CLARIFICATION_OPTIONS = ['こってり系・甘いもの', 'さっぱり系'];

type NearbyState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'denied' }
  | { phase: 'error'; message: string }
  | { phase: 'loaded'; places: NearbyPlace[] };

export default function ResultsScreen() {
  const { mood, staple } = useLocalSearchParams<{ mood: string; staple?: StaplePreference }>();
  const [clarification, setClarification] = useState<string | null>(null);
  const [nearby, setNearby] = useState<NearbyState>({ phase: 'idle' });

  const handleFindNearby = async () => {
    setNearby({ phase: 'loading' });
    const locationResult = await getCurrentCoordinates();
    if (locationResult.status === 'denied') {
      setNearby({ phase: 'denied' });
      return;
    }
    if (locationResult.status === 'error') {
      setNearby({ phase: 'error', message: locationResult.message });
      return;
    }
    try {
      const places = await fetchNearbyPlaces(locationResult.coords);
      setNearby({ phase: 'loaded', places });
    } catch (e) {
      setNearby({ phase: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  };

  const classification = useMemo(() => {
    // 聞き返しに答えた後は、その回答だけで判定し直す。元の気分入力（「元気」等の
    // 曖昧語彙）を引きずったまま判定すると、何度答えても再度聞き返しになってしまうため、
    // 一度回答したら needsClarification を強制的に解除する。
    const base = clarification
      ? { ...classifyMood(clarification), needsClarification: false }
      : classifyMood(mood ?? '');

    if (!staple) return base;
    return { ...base, results: [...base.results, { axis: 'staple' as const, value: staple, confidence: '高' as const }] };
  }, [mood, clarification, staple]);

  const suggestions = useMemo(
    () => (classification.needsClarification ? [] : buildSuggestions(classification)),
    [classification],
  );

  const recipes = suggestions.filter((s): s is RecipeSuggestion => s.channel === '自炊');
  const souzai = suggestions.find((s): s is CategorySuggestion => s.channel === '惣菜');
  const konbini = suggestions.find((s): s is CategorySuggestion => s.channel === 'コンビニ');
  const restaurants = suggestions.filter((s): s is RestaurantSuggestion => s.channel === '外食');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.moodEcho}>
        「{mood}」に対する提案{staple ? `（主食：${staple === '米' ? 'ご飯' : '麺類'}）` : ''}
      </Text>

      {classification.needsClarification ? (
        <View style={styles.clarificationBox}>
          <Text style={styles.clarificationText}>{classification.clarificationQuestion}</Text>
          <View style={styles.clarificationOptions}>
            {CLARIFICATION_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={styles.clarificationChip}
                onPress={() => setClarification(option)}
              >
                <Text style={styles.clarificationChipText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <>
          <View style={styles.nearbySection}>
            {nearby.phase === 'loading' ? (
              <View style={styles.nearbyLoading}>
                <ActivityIndicator />
                <Text style={styles.nearbyLoadingText}>現在地を取得しています…</Text>
              </View>
            ) : (
              <Pressable style={styles.nearbyButton} onPress={handleFindNearby}>
                <Text style={styles.nearbyButtonText}>
                  {nearby.phase === 'idle' ? '現在地から近くのお店を探す' : 'この条件でもう一度探す'}
                </Text>
              </Pressable>
            )}
            {nearby.phase === 'denied' && (
              <Text style={styles.nearbyMessage}>
                位置情報の利用が許可されていません。端末の設定から位置情報の利用を許可してください。
              </Text>
            )}
            {nearby.phase === 'error' && (
              <Text style={styles.nearbyMessage}>近くのお店を取得できませんでした（{nearby.message}）。</Text>
            )}
            {nearby.phase === 'loaded' && (
              <>
                <NearbyPlaceList category="convenience" places={nearby.places.filter((p) => p.category === 'convenience')} />
                <NearbyPlaceList category="supermarket" places={nearby.places.filter((p) => p.category === 'supermarket')} />
                <NearbyPlaceList category="restaurant" places={nearby.places.filter((p) => p.category === 'restaurant')} />
                {nearby.places.length === 0 && (
                  <Text style={styles.nearbyMessage}>徒歩圏内（800m以内）に該当する店舗が見つかりませんでした。</Text>
                )}
                <Text style={styles.footnote}>※ OpenStreetMap（Overpass API）のデータを利用しています。</Text>
              </>
            )}
          </View>

          {recipes.length > 0 && (
            <>
              <Text style={styles.sectionHeading}>自炊（複数候補）</Text>
              {recipes.map((r) => (
                <SuggestionCard
                  key={r.title}
                  channelLabel="自炊"
                  title={r.title}
                  description={r.description}
                  extra={r.steps}
                />
              ))}
            </>
          )}
          {souzai && (
            <SuggestionCard channelLabel="惣菜" title={souzai.headline} description={souzai.description} />
          )}
          {konbini && (
            <SuggestionCard channelLabel="コンビニ" title={konbini.headline} description={konbini.description} />
          )}

          {restaurants.length > 0 && (
            <>
              <Text style={styles.sectionHeading}>外食</Text>
              {restaurants.map((r) => (
                <RestaurantCard key={r.placeId} restaurant={r} />
              ))}
            </>
          )}

          <Text style={styles.footnote}>
            ※ 現在はモックデータで表示しています。実データ連携（Claude API / Google Places
            API）は次フェーズで接続します。
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  moodEcho: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  clarificationBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  clarificationText: {
    fontSize: 15,
    color: '#111827',
    marginBottom: 12,
  },
  clarificationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  clarificationChip: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  clarificationChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  nearbySection: {
    marginBottom: 4,
  },
  nearbyButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nearbyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  nearbyLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  nearbyLoadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  nearbyMessage: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginTop: 4,
    marginBottom: 8,
  },
  footnote: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 12,
    lineHeight: 18,
  },
});
