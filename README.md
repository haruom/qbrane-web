
## 最初にやること

1. clone する
2. `.env.example` を参考に `.env.local` を作る
3. DBを起動する
4. `npm run dev` を叩く

## DBの起動

- DBの起動
  - `docker compose up`
- DBが初期状態の時はこれを走らせる
  - `npx dotenv -e .env.local -- prisma migrate dev`
- DBの中身を見たい時はこれを叩く
  - `npx dotenv -e .env.local -- prisma studio`
