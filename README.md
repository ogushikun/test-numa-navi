# test-numa-navi

個人開発アプリサンプル - サブカル作品レコメンドWebアプリ

## プロジェクト概要

アニメ/漫画/ライトノベル領域で、選択式の質問からユーザーの嗜好を引き出し、刺さる作品を提示するレコメンドアプリケーション。

## 技術スタック

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend/Database**: Supabase
- **Hosting**: Vercel

## セットアップ

### 前提条件

- Node.js v20以上
- npm

### インストール

```bash
npm install
```

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ビルド

```bash
npm run build
```

## デプロイ

このプロジェクトは [Vercel Platform](https://vercel.com) へのデプロイを想定しています。

詳細は [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。

## ライセンス

MIT
