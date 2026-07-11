# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Personal workspace for two side businesses: app development and web writing. It is not a single application — it's a monorepo-style container with independent, unrelated projects under `apps/` plus a non-code writing workflow under `writing/`. Treat each subdirectory as its own project root; there is no shared build system, package manager workspace, or cross-project code sharing.

## Structure

```
apps/
  web/      Next.js 16 (App Router) + TypeScript + Tailwind v4 — web app development
  mobile/   Expo (React Native) + TypeScript — iOS/Android app development
writing/
  articles/    Markdown articles, one subfolder per client/project
  templates/   article-template.md — frontmatter schema for new articles
```

## Commands

All commands are run from within the relevant `apps/*` subdirectory — there is no root-level build/test/lint script.

### apps/web (Next.js)
```
cd apps/web
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
npx tsc --noEmit # type-check only
```
No test runner is configured yet.

### apps/mobile (Expo)
```
cd apps/mobile
npx expo start           # start Metro bundler; scan QR with Expo Go app
npm run android           # start + open Android
npm run ios               # start + open iOS
npm run web                # start + open web target
```
No test runner is configured yet.

## Important: read framework docs before coding

Both scaffolds ship an `AGENTS.md` (linked from `CLAUDE.md` in each subproject) warning that the pinned framework versions are newer than training data and have breaking changes:

- `apps/web`: Next.js 16 — read `apps/web/node_modules/next/dist/docs/` before using Next.js APIs.
- `apps/mobile`: Expo ~57 — read https://docs.expo.dev/versions/v57.0.0/ before using Expo APIs.

Do not assume familiar Next.js/Expo conventions apply unchanged.

## apps/web architecture

- App Router under `src/app/`; `@/*` path alias maps to `src/*` (see `tsconfig.json`).
- Tailwind v4 is configured via `@tailwindcss/postcss` in `postcss.config.mjs` (no `tailwind.config.js` — v4 uses CSS-based config in `globals.css`).
- TypeScript `strict` mode is on.

## apps/mobile architecture

- Entry point is `index.ts` → `App.tsx`.
- App metadata (name, icons, platform config) lives in `app.json`, not `package.json`.
- A Claude Code plugin (`expo@claude-plugins-official`) is enabled via `.claude/settings.json` in this subproject.

## writing/ workflow

Each article starts as a copy of `writing/templates/article-template.md` into `writing/articles/<client-or-project-name>/`. The template's frontmatter (`title`, `slug`, `status`, `client`, `target_keyword`, `word_count_target`, `publish_date`) tracks status through `draft` → `review` → `published`. This is a content directory, not code — no build step applies to it.
