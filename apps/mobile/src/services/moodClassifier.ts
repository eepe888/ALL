import type { Confidence, MoodAxis, MoodCategoryResult, MoodClassification } from '../domain/types';

// TODO(Phase 1後半): ここをClaude APIへのバックエンド経由呼び出しに置き換える。
// APIキーはクライアントに埋め込めないため、Supabase Edge Functions等のプロキシ経由にする
// （Research/Report/気分ベース食べ物提案アプリ_要件定義書.md 6-2, 8-3参照）。
//
// 現時点ではResearchの机上検証（4-6節）で使ったテストケースを再現するキーワードルールで
// 「気分→カテゴリ判定」の一連のUXフローを検証できるようにしている。

interface Rule {
  axis: MoodAxis;
  value: string;
  confidence: Confidence;
  keywords: string[];
}

const rules: Rule[] = [
  { axis: 'richness', value: 'さっぱり', confidence: '高', keywords: ['さっぱり', 'あっさり', '酢の物'] },
  { axis: 'richness', value: 'こってり', confidence: '高', keywords: ['こってり', 'がっつり', 'ガッツリ', '揚げ物'] },
  { axis: 'temperature', value: '温かい', confidence: '高', keywords: ['温か', 'あたたか', '疲れた', '寒い'] },
  { axis: 'temperature', value: '冷たい', confidence: '高', keywords: ['冷やし', '冷たい', '夏バテ', '暑い'] },
  { axis: 'spiciness', value: '辛い', confidence: '中', keywords: ['辛い', 'ピリ辛', 'スパイシー'] },
  { axis: 'volume', value: '軽め・ヘルシー', confidence: '高', keywords: ['ヘルシー', '野菜', '軽め', '小腹'] },
  { axis: 'volume', value: 'ボリューム大', confidence: '高', keywords: ['ボリューム', 'お腹いっぱい', 'がっつり'] },
  { axis: 'cuisine', value: '和食', confidence: '中', keywords: ['和食', '和風', '日本食'] },
  { axis: 'cuisine', value: '中華', confidence: '中', keywords: ['中華', '麻婆', '餃子'] },
];

// 味・温度の手がかりがなく、感情語彙のみのケース（Research 4-6の「元気を出したい」相当）
const ambiguousEmotionKeywords = ['元気', '癒し', 'なんでもいい', '疲れた気分'];

export function classifyMood(rawText: string): MoodClassification {
  const results: MoodCategoryResult[] = [];

  for (const rule of rules) {
    if (rule.keywords.some((k) => rawText.includes(k))) {
      results.push({ axis: rule.axis, value: rule.value, confidence: rule.confidence });
    }
  }

  const hasConcreteSignal = results.length > 0;
  const isAmbiguousEmotion = ambiguousEmotionKeywords.some((k) => rawText.includes(k));

  if (!hasConcreteSignal || isAmbiguousEmotion) {
    return {
      results,
      needsClarification: true,
      clarificationQuestion: 'こってり系と、さっぱり系・甘いもの、どちらの気分に近いですか？',
    };
  }

  return { results, needsClarification: false };
}
