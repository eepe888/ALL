import { recipeTemplates, type RecipeTemplate } from '../domain/recipes';
import type {
  CategorySuggestion,
  MoodClassification,
  RecipeSuggestion,
  RestaurantSuggestion,
  Suggestion,
} from '../domain/types';

// TODO(Phase 1後半): 自炊レシピはClaude APIによるその場生成に置き換える
// （固定レシピDBを持たない方針。要件定義書 5-1 #2参照）。
// 惣菜・コンビニのカテゴリ提案ロジックも同様にLLM側へ寄せる想定。
// 現時点ではカテゴリ判定結果からルールベースで妥当な提案を組み立てるモック実装。

const RECIPE_SUGGESTION_COUNT = 3;

function dominantValue(classification: MoodClassification, axis: string): string | undefined {
  return classification.results.find((r) => r.axis === axis)?.value;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function scoreTemplate(template: RecipeTemplate, classification: MoodClassification): number {
  return Object.entries(template.tags).reduce((score, [axis, value]) => {
    const matched = classification.results.some((r) => r.axis === axis && r.value === value);
    return matched ? score + 1 : score;
  }, 0);
}

// タグの一致数でスコアリングし、上位3件を返す。同点はシャッフルしてから並べ替えるため、
// 同じ気分入力でも毎回まったく同じ3件にはならず、レシピにバリエーションが出る。
function pickRecipes(classification: MoodClassification, categoryTags: string[]): RecipeSuggestion[] {
  const scored = shuffle(recipeTemplates)
    .map((template) => ({ template, score: scoreTemplate(template, classification) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, RECIPE_SUGGESTION_COUNT);

  return scored.map(({ template }) => ({
    channel: '自炊',
    categoryTags,
    title: template.title,
    description: template.description,
    steps: template.steps,
  }));
}

export function buildSuggestions(classification: MoodClassification): Suggestion[] {
  const richness = dominantValue(classification, 'richness');
  const temperature = dominantValue(classification, 'temperature');
  const volume = dominantValue(classification, 'volume');

  const leansLight = richness === 'さっぱり' || volume === '軽め・ヘルシー';
  const leansHeavy = richness === 'こってり' || volume === 'ボリューム大';

  const categoryTags = classification.results.map((r) => r.value);

  const recipes = pickRecipes(classification, categoryTags);

  const souzai: CategorySuggestion = {
    channel: '惣菜',
    categoryTags,
    headline: leansLight ? '和え物類・サラダ系がおすすめです' : leansHeavy ? '揚げ物類がおすすめです' : '煮物類がおすすめです',
    description: leansLight
      ? 'スーパーの惣菜コーナーで、酢の物・和え物・冷しゃぶサラダなどを探してみてください。'
      : leansHeavy
        ? 'から揚げ・コロッケなど揚げ物類のコーナーを見てみてください。'
        : '肉じゃが・筑前煮など煮物類のコーナーを見てみてください。',
  };

  const konbini: CategorySuggestion = {
    channel: 'コンビニ',
    categoryTags,
    headline: leansLight ? '海藻サラダ・冷やし麺系がおすすめです' : leansHeavy ? 'から揚げ系・お弁当がおすすめです' : 'あたたかい麺類・スープがおすすめです',
    description: temperature === '冷たい'
      ? '冷やし中華やサラダチキンなど、冷たく食べられるものが近くにあるはずです。'
      : 'コンビニのホット惣菜コーナーやカップ麺コーナーを見てみてください。',
  };

  const restaurants: RestaurantSuggestion[] = mockRestaurants(leansLight, leansHeavy);

  return [...recipes, souzai, konbini, ...restaurants];
}

// TODO(Phase 1後半): Google Places API（New）に置き換える。
// ジャンル・評価・距離・口コミAI要約を取得し、気分カテゴリでフィルタする
// （要件定義書 5-1 #4, 8-1 RestaurantRecommendationCache参照）。
function mockRestaurants(leansLight: boolean, leansHeavy: boolean): RestaurantSuggestion[] {
  if (leansLight) {
    return [
      {
        channel: '外食',
        categoryTags: ['和食', 'さっぱり'],
        placeId: 'mock-1',
        name: '定食屋 みずほ',
        genre: '和食・定食',
        rating: 4.2,
        distanceMeters: 320,
        reviewSummary: '口コミでは「あっさりしていて食べやすい」という声が多いお店です。',
      },
      {
        channel: '外食',
        categoryTags: ['サラダ'],
        placeId: 'mock-2',
        name: 'サラダ専門店 GREEN',
        genre: 'サラダ・カフェ',
        rating: 4.0,
        distanceMeters: 480,
        reviewSummary: '野菜が多く、ヘルシー志向の人に人気と口コミにあります。',
      },
    ];
  }
  if (leansHeavy) {
    return [
      {
        channel: '外食',
        categoryTags: ['焼肉', 'ボリューム'],
        placeId: 'mock-3',
        name: '焼肉 大将',
        genre: '焼肉',
        rating: 4.3,
        distanceMeters: 600,
        reviewSummary: '「ボリューム満点でガッツリ食べたい日におすすめ」という口コミが目立ちます。',
      },
      {
        channel: '外食',
        categoryTags: ['ラーメン'],
        placeId: 'mock-4',
        name: 'ラーメン 火山',
        genre: 'ラーメン',
        rating: 4.1,
        distanceMeters: 250,
        reviewSummary: '濃厚こってり系との口コミ多数。',
      },
    ];
  }
  return [
    {
      channel: '外食',
      categoryTags: ['定食'],
      placeId: 'mock-5',
      name: '食堂 ひだまり',
      genre: '定食・和食',
      rating: 4.0,
      distanceMeters: 400,
      reviewSummary: 'バランスの良い定食が中心と口コミにあります。',
    },
  ];
}
