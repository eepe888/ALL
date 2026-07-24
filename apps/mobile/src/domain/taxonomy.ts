import type { FoodCategory } from './types';

// 日本標準商品分類の惣菜8分類（要件定義書 5-1 #3, 8-1 FoodCategoryTaxonomy）
// + コンビニのカテゴリ（もぐナビ等の分類を参考にした簡易版）
export const foodCategoryTaxonomy: FoodCategory[] = [
  { id: 'souzai.nimono', channel: '惣菜', label: '煮物類' },
  { id: 'souzai.yakimono', channel: '惣菜', label: '焼き物類' },
  { id: 'souzai.itamemono', channel: '惣菜', label: '炒め物類' },
  { id: 'souzai.agemono', channel: '惣菜', label: '揚げ物類' },
  { id: 'souzai.mushimono', channel: '惣菜', label: '蒸し物類' },
  { id: 'souzai.aemono', channel: '惣菜', label: '和え物類' },
  { id: 'souzai.beihan', channel: '惣菜', label: '米飯類' },
  { id: 'souzai.other', channel: '惣菜', label: 'その他調理食品' },
  { id: 'konbini.onigiri', channel: 'コンビニ', label: 'おにぎり・寿司' },
  { id: 'konbini.bento', channel: 'コンビニ', label: 'お弁当' },
  { id: 'konbini.men', channel: 'コンビニ', label: '麺類（カップ麺・そば・パスタ）' },
  { id: 'konbini.souzai', channel: 'コンビニ', label: '惣菜・サラダ' },
  { id: 'konbini.sweets', channel: 'コンビニ', label: 'スイーツ・デザート' },
];

export function findCategoryLabel(id: string): string {
  return foodCategoryTaxonomy.find((c) => c.id === id)?.label ?? id;
}
