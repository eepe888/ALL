# WhyJapan — Claude Code プロジェクト仕様書

> このドキュメントは、YouTube Shorts チャンネル「WhyJapan」の制作を Claude Code 上で
> 管理・半自動化するためのプロジェクト仕様書です。リポジトリのルートに置き、
> `CLAUDE.md` とセットで運用します。

---

## 0. このプロジェクトの目的

- **主目的：** 素材とドキュメントの一元管理 ＋ できる範囲での自動化（半自動）
- **管理対象：** 企画書、ブランド規定、制作パイプライン、各話の台本・原稿・ショットリスト・投稿メタデータ・生成物
- **自動化の範囲（当面）：** 音声生成は ElevenLabs MCP を使い、Claude Code との対話で1本ずつ行う。字幕生成などのスクリプト自動化は将来の拡張枠として用意のみ（今は実装しない）
- **言語方針：** ドキュメントは日本語。動画の最終アウトプット（台本本文・ナレーション）は英語

---

## 1. 技術方針

| 項目 | 決定 |
|---|---|
| リポジトリ言語 | Node / TypeScript 中心（将来のスクリプト用。現時点でコードは最小限） |
| 音声生成 | ElevenLabs **MCP**（対話で1本ずつ）。API直叩きは将来検討 |
| 映像生成 | Kling 3.0 中心 ＋ 掴みのみ Veo 3.1（手動。ツール側で生成） |
| 編集・字幕 | CapCut（手動） |
| ドキュメント記述 | 日本語（Markdown） |
| 複数話管理 | `episodes/epNN/` で1リポジトリ内に集約 |

---

## 2. ディレクトリ構成

```
whyjapan/
├── CLAUDE.md                  # Claude Codeへの指示書（最重要・最初に読ませる）
├── README.md                  # プロジェクト概要・セットアップ手順
├── .mcp.json                  # MCP設定（ElevenLabs等）※APIキーは環境変数
├── .gitignore
│
├── docs/                      # 企画・規定ドキュメント（共通・固定）
│   ├── concept.md             # チャンネル企画（コンセプト・3本柱・ターゲット）
│   ├── brand.md               # ブランド規定（配色・ロゴ・トーン）
│   └── pipeline.md            # 制作パイプライン（6工程）
│
├── assets/                    # 共通ブランド素材
│   ├── logo/                  # バナー・アイコン（PNG）
│   ├── fonts/                 # 使用フォントの規定（実体 or 参照メモ）
│   └── templates/             # 台本テンプレ・ショットリスト雛形
│       ├── script.template.md
│       └── shotlist.template.md
│
├── episodes/                  # 話ごと（青＝増えていく）
│   └── ep01/                  # 第1話：Why Japan Has No Street Names
│       ├── script.md          # 台本（HOOK/SETUP/PAYOFF/BUTTON）
│       ├── narration.txt      # TTS用に整えたナレーション原稿
│       ├── shotlist.md        # ショット対応表
│       ├── prompts.md         # Kling/Veo用プロンプト
│       ├── metadata.md        # タイトル・説明文・タグ・AI開示メモ
│       ├── audio/             # ElevenLabsで生成した音声（.mp3）
│       ├── figures/           # 図解キーフレーム（.png）
│       └── output/            # 最終書き出し（.mp4）
│
└── scripts/                   # 将来の拡張枠（今は空 or READMEのみ）
    └── README.md              # 「字幕生成・尺チェック等を後日ここに」
```

**運用ルール**
- 新しい話は `assets/templates/` を `episodes/epNN/` にコピーして開始する
- 生成物（audio / figures / output）は容量が大きいものは `.gitignore` 対象を検討（後述）
- `docs/` と `assets/` は全話で共有する不変資産

---

## 3. CLAUDE.md 完成版

> 以下をそのまま `CLAUDE.md` としてリポジトリルートに保存してください。
> Claude Code は起動時にこれを読み、プロジェクトの文脈・ルールを把握します。

````markdown
# WhyJapan — Claude Code 指示書

あなたは YouTube Shorts チャンネル「WhyJapan」の制作アシスタントです。
このリポジトリで、企画・台本・素材・投稿メタデータの管理と、音声生成の補助を行います。

## チャンネルの核

- **コンセプト：** 日本の文化・技術・デザインの背後にある「なぜ」を、
  エンジニア／デザイナーの視点で構造的に解き明かす faceless AI チャンネル。
- **差別化：** 一次知識（日本在住・日本語ネイティブ）＋ 構造的視点。
  「日本は不思議で綺麗」系の感覚的な語りは避け、因果・システムとして説明する。
- **ターゲット：** 英語圏（米英加豪）の、日本に関心はあるが表面的な情報に飽きた層。
- **主軸：** 「なぜ寄り」。ものづくり・構造は「なぜ」の証拠として事例で使う。

## 動画フォーマット

- 尺：60〜90秒（英語で約130〜180語）
- 構成：HOOK（0-3秒）→ SETUP（3-15秒）→ PAYOFF（15-68秒）→ BUTTON（68-80秒）
- 音声：英語TTS（ElevenLabs）。声は固定してチャンネルの識別に使う
- 字幕：必須（無音視聴8割）。キーワードのみブランド色の朱で強調
- 映像：Kling 3.0中心＋掴みのみVeo 3.1。図解は自作
- 投稿：1日1〜2本まで

## ブランド規定

- 配色：墨 #14171C / 朱 #E34234 / 和紙 #F4F1EA / 藍 #1F3A5F / MUTED #8A8578
- ロゴ："Why"（白）+"Japan"（朱）+ 落款「何」。日本要素は一点だけ効かせる
- トーン：落ち着いた解説者。断定は事実のみ、推測は "likely" を添える
- サムネ：上部に朱kicker＋落款、中央に大きな問い（1色ハイライト）、下に答えの予告1行

## 台本作成のルール

台本を書くときは必ず次の4部構成テンプレに従うこと：

- HOOK（0-3秒/15語以内）：問い or 対比で始める。「In most countries X. But in Japan, Y.」
- SETUP（3-15秒/30語前後）：なぜ不思議に見えるかを一段深める
- PAYOFF（15-68秒/80語前後）：理由を因果で説明。一次知識を凝縮
- BUTTON（68-80秒/20語前後）：視点を1つ残して締める

台本と同時に shotlist.md（ショット対応表）も作ること。
事実は断定し、推測には likely を付ける。正確さがこのチャンネルの信頼を作る。

## ナレーション原稿（TTS最適化）のルール

narration.txt を作るときは ElevenLabs での読み上げを想定して整える：

- 数字は読み下しに（例：2-21-1 → two, twenty-one, one／1873 → eighteen seventy-three）
- 決め所に三点リーダ（...）で「間」を作る（入れすぎない）
- 日本語固有名詞は音写に（chōme → chome、gō → go。マクロンを外す）
- 段落＝ショットの区切り（空行で分ける）

## 音声生成（ElevenLabs MCP）

音声生成を頼まれたら、ElevenLabs MCP を使って narration.txt から mp3 を生成する。

- 声は固定（初回に決めた声を全話で使う。例：Brian / Daniel / Alice 系）
- 設定の目安：Stability 50 / Similarity 75 / Speed やや遅め
- 出力は該当話の audio/ に保存する

## ポリシー適合（収益化を守る要）

- 各動画に独自の解説・視点・構成を必ず入れる（テンプレ量産と見なされないため）
- 「AIが専門家として助言」する演出はしない。教育・解説の立場に徹する
- AI開示：実写と誤認する映像（Kling/Veo実写ショット）を使った回のみ、
  アップロード時に「変更または合成コンテンツ」トグルをON。図解・音声のみは対象外
- BGMは無音 or YouTubeオーディオライブラリの収益化可トラックのみ

## ディレクトリの扱い

- 新しい話は assets/templates/ を episodes/epNN/ にコピーして始める
- docs/ と assets/ は全話共通の不変資産。無断で変更しない
- 生成物は各話の audio/ figures/ output/ に置く

## あなた（Claude Code）への依頼の型

- 「epNN の台本を書いて」→ 上のテンプレで script.md と shotlist.md を作る
- 「narration.txt を整えて」→ TTS最適化ルールで変換
- 「音声を生成して」→ ElevenLabs MCP で narration.txt から mp3 を audio/ に出力
- 「メタデータを作って」→ metadata.md にタイトル・説明文・タグ・AI開示メモ

要件が曖昧な場合は、手を動かす前に必ず質問すること。
結論を先に、理由を後に述べること。
````

---

## 4. 初期セットアップ手順

### 4-1. リポジトリ作成

```bash
mkdir whyjapan && cd whyjapan
git init
npm init -y
mkdir -p docs assets/logo assets/fonts assets/templates \
         episodes/ep01/{audio,figures,output} scripts
```

### 4-2. CLAUDE.md を配置

上記「3. CLAUDE.md 完成版」の内容を `CLAUDE.md` として保存。
（Claude Code で `/init` を使うと雛形が作られるので、その中身を上記で置き換えてもよい）

### 4-3. ElevenLabs MCP を登録

前提：ElevenLabs の API キーと `uv`（uvx 同梱）。未導入なら：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Claude Code に MCP サーバーを登録：

```bash
claude mcp add elevenlabs \
  -e ELEVENLABS_API_KEY=あなたのAPIキー \
  -- uvx elevenlabs-mcp
```

> APIキーは ElevenLabs アカウント設定から取得。無料枠は月10kクレジット。
> Windows で Claude Desktop から使う場合は Developer Mode の有効化が必要
> （Claude Code の CLI から使う分には上記コマンドで登録可）。
> 設定方法は変わることがあるため、実施時は公式リポジトリ
> github.com/elevenlabs/elevenlabs-mcp の最新 README を確認すること。

### 4-4. .gitignore（生成物の扱い）

音声・動画は容量が大きくなりやすい。Git管理するか判断して設定：

```gitignore
node_modules/
.env
# 大容量の生成物を管理外にする場合（判断して調整）
episodes/**/output/*.mp4
episodes/**/audio/*.mp3
```

> 図解（figures/*.png）は軽量かつ再現に手間がかかるので Git 管理推奨。
> 音声・動画は再生成可能なので、リポジトリを軽く保つなら ignore 対象に。

---

## 5. 既存資産の配置マップ

これまでに作成済みの成果物を、上の構成のどこに置くかの対応表：

| 既存の成果物 | 配置先 |
|---|---|
| チャンネルバナー・アイコン（PNG 3点） | `assets/logo/` |
| 企画書＋制作工程 PDF | `docs/`（参照用）。本文は concept.md / pipeline.md に転記 |
| 第1話 台本（HOOK〜BUTTON） | `episodes/ep01/script.md` |
| 第1話 ナレーション原稿 | `episodes/ep01/narration.txt` |
| 第1話 図解 5枚（shot2〜6） | `episodes/ep01/figures/` |
| 第1話 Kling/Veoプロンプト（shot1・7） | `episodes/ep01/prompts.md` |
| 第1話 編集タイムライン | `episodes/ep01/shotlist.md` に統合 |
| ブランドボード（配色・トーン） | `docs/brand.md` |

---

## 6. 第1話（ep01）の完成チェックリスト

- [ ] script.md（台本）配置済み
- [ ] narration.txt（TTS最適化済み）配置済み
- [ ] 音声生成（ElevenLabs MCP → audio/）※要 MCP セットアップ
- [ ] figures/ に図解5枚配置
- [ ] prompts.md の Kling/Veo で shot1・7 を生成 → 素材化
- [ ] CapCut で編集・字幕 → output/ に mp4
- [ ] metadata.md（タイトル・説明文・タグ・AI開示メモ）作成
- [ ] YouTube Studio へアップ（AI開示：shot1/7 使用時ON）

---

## 7. 未確定・将来の拡張

- **scripts/ の実装：** 字幕（SRT）生成、台本の尺・語数チェック等を後日追加
- **音声の自動化：** 量産フェーズで ElevenLabs API 直叩きへ移行を検討
- **映像ツール：** Kling/Veo は流動的。1本作る中で相性を見て Runway/Seedance も検討
- **チャンネル名の最終確認：** YouTubeハンドル @whyjapan 系・.com・SNSの空きは着手前に要確認

---

## 8. 運用の原則（Claude Code への期待）

- 結論を先に、理由を後に
- 要件が曖昧なら手を動かす前に質問する
- 決定は1つずつ確認してから実装に移る
- ブランド規定（配色・トーン・ポリシー適合）を常に守る