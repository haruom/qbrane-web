# SleePIN

![Screenshot 2024-03-13 at 22.16.56.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/81a1044d-130a-4d06-8202-d378ff93fc9d/a6c18621-c766-4f63-aab5-bbc1f01b7a5d/Screenshot_2024-03-13_at_22.16.56.png)

Githubレポジトリ：https://github.com/haruom/qbrane-web

デモアプリ：https://duckling-electric-snake.ngrok-free.app/status

## 開発の背景

日本人の平均睡眠時間は、世界OECDによる2021年版の調査によると33カ国の中で最も短く、日本人の睡眠不足が大きな社会問題になっている。睡眠不足による日本の経済損失は、年間約15兆円に及ぶと言われており、プレゼンティーイズムと呼ばれる「健康の問題を抱えつつも仕事を行っている状態」が日本で慢性化している。私達はこの社会問題を解決するため、日本人の睡眠時間を少しでも延ばし、健康増進やパフォーマンス向上することを目的として、長くて質の良い睡眠を取ると仮想通貨を報酬として得られる「SleePIN」とよばれるハイブリッドフルオンチェーンシステムを開発した。

## SleePINの概要

SleePINは睡眠を正確に計測できる「Ouraリング」と呼ばれるウェアラブルデバイスを身に付けて睡眠データを取得し、その睡眠データを睡眠研究機関に提供することで、ユーザーは報酬として仮想通貨（Polygon）を獲得できるアプリケーションである。睡眠研究期間は、その睡眠データを活用した研究を行い、睡眠の個人最適化システムなどのAI開発を行うことで、ユーザーへ対する健康利益を提供することができるようになる。

### ウェブアプリデモ

![Screenshot 2024-03-13 at 21.28.18.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/81a1044d-130a-4d06-8202-d378ff93fc9d/c575095a-9b25-451b-9117-575fb1c33e3a/Screenshot_2024-03-13_at_21.28.18.png)

睡眠データによる報酬獲得

![Screenshot 2024-03-13 at 21.29.27.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/81a1044d-130a-4d06-8202-d378ff93fc9d/ff731a8b-b432-4e65-b312-36649aea0977/Screenshot_2024-03-13_at_21.29.27.png)

獲得トークンの引き出し

![Screenshot 2024-03-13 at 21.30.07.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/81a1044d-130a-4d06-8202-d378ff93fc9d/edc46f97-505e-4ad4-8b11-47161211ac97/Screenshot_2024-03-13_at_21.30.07.png)

### 睡眠データの保存

睡眠データは、OuraのAPIを経由して取得され、シンボルのテストネット上に暗号化して格納される。アクセス権を持っている睡眠機関がチェーン上の睡眠データを取得することが可能である。以下は睡眠データが保存されているシンボルチェーンのURLの例である。

http://20.48.92.124:3000/transactions/confirmed/B8CE55B531964ACB8A4BA27EB61668E2F741ED460307BD630BFFAE85F29C597D

※実運用時は、プラベートなシンボルチェーンに保存する。

### データへのアクセス権NFT

ユーザーは自分の睡眠データへアクセスできるNFTを提供することでその対価を報酬として受け取ることができる。この時、ユーザーはデータを睡眠機関へ共有することに同意したとみなすこととする（アカウント作成時の利用規約やプライバシーポリシーで規定する）。NFTを持っている睡眠機関のみが、睡眠データが保存されているURLへアクセス可能となり、データを取得して分析に使用することができる。

### 報酬計算に用いた計算式

Ouraリングを装着して睡眠するだけで、睡眠時間に応じたトークンを獲得することができる。報酬に用いられる計算式は以下の通りである。

睡眠データの報酬(MATIC)は下記の合計 (1+2) とする

1. 睡眠データ素点：0.5 (MATIC)
2. 睡眠時間ボーナスの計算式：y=0.5*(1−e ^−0.5x) (MATIC)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/81a1044d-130a-4d06-8202-d378ff93fc9d/9baebbe9-b259-49a5-8791-b40caaf2d054/Untitled.png)

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
