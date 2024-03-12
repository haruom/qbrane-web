This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## メモ

- DBの起動
  - docker compose up
- DBが初期状態の時
  - npx dotenv -e .env.local -- prisma migrate dev
- DBの中身を見る
  - npx dotenv -e .env.local -- prisma studio
- DBのダンプ
  - docker-compose.yml の db の volumes に↓を足す
    - `./db_dump:/tmp/db_dump`
  - `docker compose exec db bash`
  - `pg_dump --create --clean --if-exists -U user qbrane > /tmp/db_dump/dump.sql`

- 原因よく分かってないけどSymbol使う時に`NEXT_NOT_FOUND`みたいなエラーが出る時
  - `cp node_modules/symbol-crypto-wasm-node/symbol_crypto_wasm_bg.wasm .next/server/vendor-chunks/`
