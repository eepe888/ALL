# 副業ワークスペース

アプリ開発とWEBライティングの副業用ワークスペース。

## 構成

```
apps/
  web/      Next.js (TypeScript + Tailwind) - Webアプリ開発用
  mobile/   Expo (TypeScript) - iOS/Androidアプリ開発用
writing/
  articles/    執筆した記事
  templates/   記事テンプレート
```

## 開発の始め方

### Webアプリ (apps/web)
```
cd apps/web
npm run dev
```

### モバイルアプリ (apps/mobile)
```
cd apps/mobile
npx expo start
```
Expo Go アプリ(iOS/Android)でQRコードを読み取れば実機確認可能。

## WEBライティング
`writing/templates/article-template.md` をコピーして `writing/articles/<案件名>/` に記事を作成。
