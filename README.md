
## 最初にやること

1. clone する
2. `.env.example` を参考に `.env.local` を作る
3. DBを起動する
4. `npm run dev` を叩く

## DBの起動

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
