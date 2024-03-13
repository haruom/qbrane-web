import { sleep } from "@/lib/oura/client";
import { calcAmount } from "@/lib/reward/reward";
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
