import { logoutAndGoHome } from "@/lib/next-auth/auth";
import { dailySleep, sleep } from "@/lib/oura/client";
import Calendar, { CalendarProps } from "./calendar";
import Token, { } from "./token";
import Image from "next/image"

export default async function Page() {
  try {
    const [totalScore, data] = await getCalenderProps();
    return (<>
      <Image src="/SleepinWhite.svg" alt="sleepin white" className="m-5" width={100} height={100} />
      <Calendar totalScore={totalScore} data={data} />
      <Token />
    </>);
  } catch (e) {
    console.error(e);
    await logoutAndGoHome();
  }
}

async function getCalenderProps() {
  const startDate = ((d) => { d.setDate(1); return d })(new Date());
  const endDate = new Date();
  const dailySleepData = await dailySleep(startDate, endDate);
  const sleepData = await sleep(startDate, endDate);

  let totalScore = 0;
  const data = dailySleepData.data.reduce(
    (acc, d) => {
      const day = parseInt(d.day.slice(-2));
      const score = d.score ?? 0;
      totalScore += score;

      // 1日の合計睡眠時間 (単位: 秒)
      const total_sleep_duration = sleepData.data
        .filter(x => x.day === d.day)
        .reduce((acc, x) => acc + x.total_sleep_duration, 0)
      const totalMinute = Math.floor(total_sleep_duration / 60);
      const minute = totalMinute % 60;
      const hour = (totalMinute - minute) / 60;
      const totalSleepTime = { hour, minute };
      acc[day] = { score, totalSleepTime };
      return acc;
    },
    {} as CalendarProps['data']
  );

  return [totalScore, data] as const;
}
