import { getUserId, logoutAndGoHome } from "@/lib/next-auth/auth";
import Token, { } from "./token";
import Image from "next/image"
import { PrismaClient } from "@prisma/client";
import { bigint2Float } from "@/lib/reward/reward";

export default async function Page() {
  try {
    const { records, balance } = await getProps();
    return (<>
      <Image src="/SleepinWhite.svg" alt="sleepin white" className="m-5" width={100} height={100} />
      <h3 className="text-center">{`残高: ${balance} MATIC`}</h3>
      <Token records={records} />
    </>);
  } catch (e) {
    console.error(e);
    await logoutAndGoHome();
  }
}

async function getProps() {
  const userId = await getUserId()
  const prisma = new PrismaClient();
  const records_ = await prisma.record.findMany({
    where: { userId }
  })
  await prisma.$disconnect()
  const records = records_.map(({ userId, id, ...rest }) => rest) // 不要な情報を取り除く

  const balance_ = records.reduce((acc, { amount }) => acc + amount, BigInt(0))
  const balance = bigint2Float(balance_)
  return { records, balance }
}
