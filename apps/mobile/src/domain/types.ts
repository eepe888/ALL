// 要件定義書（Research/Report/気分ベース食べ物提案アプリ_要件定義書.md）8章のデータ設計に対応する型定義

export type MoodAxis =
  | 'temperature' // 温冷
  | 'richness' // さっぱり/こってり
  | 'spiciness' // 辛さ
  | 'volume' // ボリューム感
  | 'cuisine' // 和洋中
  | 'staple'; // 主食（米/麺類）。キーワード推定ではなく明示選択で入力される想定

export type StaplePreference = '米' | '麺';

export type Confidence = '高' | '中' | '低';

export interface MoodCategoryResult {
  axis: MoodAxis;
  value: string;
  confidence: Confidence;
}

export interface MoodClassification {
  results: MoodCategoryResult[];
  needsClarification: boolean;
  clarificationQuestion?: string;
}

export type SuggestionChannel = '自炊' | '惣菜' | 'コンビニ' | '外食';

export interface FoodCategory {
  id: string;
  channel: SuggestionChannel;
  label: string;
  parentId?: string;
}

export interface RecipeSuggestion {
  channel: '自炊';
  categoryTags: string[];
  title: string;
  description: string;
  steps: string[];
}

export interface CategorySuggestion {
  channel: '惣菜' | 'コンビニ';
  categoryTags: string[];
  headline: string;
  description: string;
}

export interface RestaurantSuggestion {
  channel: '外食';
  categoryTags: string[];
  placeId: string;
  name: string;
  genre: string;
  rating: number;
  distanceMeters: number;
  reviewSummary: string;
}

export type Suggestion = RecipeSuggestion | CategorySuggestion | RestaurantSuggestion;

export interface SuggestionResult {
  moodInputRawText: string;
  classification: MoodClassification;
  suggestions: Suggestion[];
}

// 現在地ベースの近隣店舗検索（OpenStreetMap/Overpass API由来の実データ）
// 要件定義書 5-1 #4「近隣飲食店の推薦」の実装第一弾。
// ジャンル・評価・口コミ要約はGoogle Places API接続後の拡張対象（6-2参照）。
export type NearbyPlaceCategory = 'convenience' | 'supermarket' | 'restaurant';

export interface NearbyPlace {
  id: string;
  category: NearbyPlaceCategory;
  name: string;
  distanceMeters: number;
  subLabel?: string; // 例: cuisine タグやamenity種別
}
