import { logoutAndGoHome } from "@/lib/next-auth/auth";
import Token, { } from "./token";
import Image from "next/image"
import { getRewardState } from "@/lib/reward/reward";

export default async function Page() {
  try {
    const { records, balance } = await getRewardState();
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
