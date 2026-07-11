# WEBライティング作業フォルダ

## 構成
- `templates/` - 記事執筆用のテンプレート
- `articles/` - 実際の記事(案件ごとにサブフォルダを作成)

## 記事の書き方
1. `templates/article-template.md` を `articles/<案件名>/` にコピー
2. frontmatter(title, slug, status, client, target_keyword など)を記入
3. 執筆後、`status` を draft → review → published と更新

## 推奨VSCode拡張機能
- Markdown All in One
- markdownlint
- Japanese Word Count(文字数カウント)
