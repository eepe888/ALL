// TODO(Phase 1後半): Claude APIによるその場生成に置き換える予定の暫定レシピプール。
// 固定候補だけだとバリエーションが乏しいため、複数レシピをタグでマッチングし
// 上位候補を複数返せるようにしている（要件定義書 5-1 #2参照）。

export interface RecipeTemplate {
  title: string;
  description: string;
  steps: string[];
  tags: {
    richness?: 'さっぱり' | 'こってり';
    temperature?: '温かい' | '冷たい';
    volume?: '軽め・ヘルシー' | 'ボリューム大';
    spiciness?: '辛い';
    cuisine?: '和食' | '中華';
    staple?: '米' | '麺';
  };
}

export const recipeTemplates: RecipeTemplate[] = [
  {
    title: '鶏むね肉と水菜の梅おかかサラダ',
    description: 'さっぱり系の気分に合わせた、火を使う工程を最小限にした一品。',
    steps: ['鶏むね肉を茹でて手でさく', '水菜を食べやすい長さに切る', '梅干し・かつお節・ポン酢で和える'],
    tags: { richness: 'さっぱり', volume: '軽め・ヘルシー' },
  },
  {
    title: '冷しゃぶサラダ',
    description: '冷たくさっぱり食べられる、暑い日にも合う一品。',
    steps: ['豚肉をしゃぶしゃぶして冷水で締める', '野菜を千切りにする', 'ポン酢か胡麻だれで和える'],
    tags: { richness: 'さっぱり', temperature: '冷たい' },
  },
  {
    title: '冷奴と薬味のせ',
    description: '調理時間ほぼゼロで、さっぱり和食の気分に合う一品。',
    steps: ['豆腐を冷やしておく', '長ねぎ・生姜・かつお節をのせる', '醤油をかける'],
    tags: { richness: 'さっぱり', cuisine: '和食' },
  },
  {
    title: '豚バラの生姜焼き丼',
    description: 'ガッツリ系の気分に合わせたボリューム重視の一品。',
    steps: ['豚バラを生姜だれに漬け込む', '中火で焼く', 'ご飯にのせて丼にする'],
    tags: { richness: 'こってり', volume: 'ボリューム大', staple: '米' },
  },
  {
    title: '梅しらすご飯',
    description: 'さっぱり系でご飯が食べたい気分に合う、調理時間の短い一品。',
    steps: ['ご飯を炊く', '梅干しとしらすをのせる', '大葉を刻んで散らす'],
    tags: { richness: 'さっぱり', staple: '米' },
  },
  {
    title: '冷やし中華',
    description: 'さっぱり系で麺類が食べたい気分、特に暑い日に合う一品。',
    steps: ['麺を茹でて冷水で締める', '具材（ハム・卵・きゅうり）を細切りにする', 'たれをかける'],
    tags: { richness: 'さっぱり', temperature: '冷たい', staple: '麺' },
  },
  {
    title: '鶏の唐揚げ',
    description: 'こってり系の気分にまっすぐ応える揚げ物の定番。',
    steps: ['鶏もも肉を醤油・生姜・にんにくに漬け込む', '片栗粉をまぶす', '油でカラッと揚げる'],
    tags: { richness: 'こってり' },
  },
  {
    title: '麻婆豆腐',
    description: 'こってり＆辛さのどちらの気分にも応えられる中華の定番。',
    steps: ['豚ひき肉を炒める', '豆板醤・甜麺醤で味付け', '豆腐を加えてとろみをつける'],
    tags: { richness: 'こってり', cuisine: '中華', spiciness: '辛い', staple: '米' },
  },
  {
    title: '具沢山味噌汁定食',
    description: '温かさとバランスを重視した定番の一品。',
    steps: ['野菜を切る', '出汁で煮る', '味噌を溶き入れる'],
    tags: { temperature: '温かい', cuisine: '和食', staple: '米' },
  },
  {
    title: 'あんかけ焼きそば',
    description: '温かく、中華の気分にも合うボリューム系の一品。',
    steps: ['麺をパリッと焼く', '野菜と肉を炒める', '中華あんを作ってかける'],
    tags: { temperature: '温かい', cuisine: '中華', staple: '麺' },
  },
  {
    title: 'ピリ辛担々麺',
    description: '辛いものが食べたい気分にまっすぐ応える一品。',
    steps: ['ひき肉をラー油と豆板醤で炒める', 'スープを作る', '茹でた麺にかける'],
    tags: { spiciness: '辛い', temperature: '温かい', staple: '麺' },
  },
  {
    title: '蒸し鶏と野菜の胡麻だれ',
    description: 'ヘルシー志向の気分に合わせた、油をあまり使わない一品。',
    steps: ['鶏むね肉と野菜を蒸す', '胡麻だれを作る', 'かけて完成'],
    tags: { volume: '軽め・ヘルシー' },
  },
  {
    title: '肉じゃが定食',
    description: 'ボリュームと和食の気分の両方に応える定番の一品。',
    steps: ['肉と野菜を炒める', '出汁・醤油・みりんで煮込む', 'ご飯と一緒に盛り付ける'],
    tags: { volume: 'ボリューム大', cuisine: '和食', staple: '米' },
  },
  {
    title: '野菜炒め定食',
    description: '特にはっきりした軸がない気分でも合わせやすい定番の一品。',
    steps: ['野菜と肉を切る', '強火でさっと炒める', '塩コショウか醤油で味付け'],
    tags: { staple: '米' },
  },
  {
    title: 'ボリューム焼きうどん',
    description: 'ガッツリ系で麺類が食べたい気分に合う一品。',
    steps: ['うどんを軽く炒める', '豚肉と野菜を炒め合わせる', 'ソースまたは醤油で味付け'],
    tags: { richness: 'こってり', volume: 'ボリューム大', staple: '麺' },
  },
];
