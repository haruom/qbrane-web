import { sleep } from "@/lib/oura/client";
import { store } from "@/lib/symbol/store";
import { PrismaClient } from "@prisma/client";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const accountId = searchParams.get('accountId');
  const dateStr = searchParams.get('date');
  if (!accountId || !dateStr) {
    return Response.json({ message: 'not enough params' }, { status: 400 });
  }

  const prisma = new PrismaClient();
  const account = await prisma.account.findFirst({
    where: { providerAccountId: accountId, provider: 'oura' }
  })
  if (!account) {
    return Response.json({ message: 'Oura account not found' }, { status: 500 });
  }

  const userId = account.userId;

  const [year, month_, date] = dateStr.split('-').map(x => parseInt(x))
  const month = month_ - 1
  const targetDate = new Date(Date.UTC(year, month, date));
  const startDate = new Date(targetDate);
  startDate.setDate(targetDate.getDate() - 1);
  const endDate = new Date(targetDate);
  endDate.setDate(targetDate.getDate() + 1);

  const sleepData = (await sleep(startDate, endDate, accountId)).data
    .filter(x => x.day === dateStr)
  if(sleepData.length === 0) {
    return Response.json({ message: `${dateStr} 分の睡眠データが存在しません` }, { status: 400 });
  }

  const sd = await prisma.encryptedSleepData.findFirst({
    where: {
      userId,
      date: targetDate
    }
  })

  if (sd) {
    return Response.json({ message: 'already saved' })
  }

  const dataStr = JSON.stringify(sleepData);
  try {
    const { aggregateTransactionHash, keyStr, ivStr } = await store(dataStr);
    await prisma.encryptedSleepData.create({
      data: {
        userId, date: targetDate, keyStr, ivStr,
        transactionHash: aggregateTransactionHash,
      }, 
    })

    const { sleepDuration, amount } = calcAmount(sleepData);
    await prisma.record.create({
      data: {
        userId, type: 'SLEEP',
        sleepDate: targetDate.toISOString(), sleepDuration, amount
      }
    })
  } catch {
    return Response.json({ message: 'Symbol へのデータ保存に失敗しました' }, { status: 500 });
  }

  await prisma.$disconnect()
  return Response.json({ message: `${dateStr}分の睡眠データを保存しました` })
}

/**
 * 睡眠データの報酬(MATIC)は下記の合計 (1+2) とする
 * 1. 睡眠データ素点：0.5 (MATIC)
 * 2. 睡眠時間ボーナスの計算式：y=0.5*(1−e^−0.5x) (MATIC)
 * @param sleepData 
 * @returns amount の単位は浮動小数点数の計算を避けるため 0.001 MATIC とする。DBに格納する値も同じ単位とする
 */
function calcAmount(sleepData: { total_sleep_duration: number }[]) {
  const sleepDuration = sleepData.map(x => x.total_sleep_duration).reduce((a, b) => a + b, 0)
  const x = sleepDuration / 60 / 60; // 時間(hour)に換算
  const base = 0.5; // 睡眠データ素点
  const bonus = 0.5 * (1 - (Math.E ** (-0.5 * x))) // 睡眠時間ボーナス
  const amount = Math.floor((base + parseFloat(bonus.toFixed(3))) * 1000);
  return { sleepDuration, amount };
}
