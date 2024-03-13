
/**
 * 睡眠データの報酬(MATIC)は下記の合計 (1+2) とする
 * 1. 睡眠データ素点：0.5 (MATIC)
 * 2. 睡眠時間ボーナスの計算式：y=0.5*(1−e^−0.5x) (MATIC)
 * @param sleepData 
 * @returns amount の単位は浮動小数点数の計算を避けるため 0.001 MATIC とする。DBに格納する値も同じ単位とする
 */
export function calcAmount(sleepData: { total_sleep_duration: number }[]) {
  const sleepDuration = sleepData.map(x => x.total_sleep_duration).reduce((a, b) => a + b, 0)
  const x = sleepDuration / 60 / 60; // 時間(hour)に換算
  const base = 0.5; // 睡眠データ素点
  const bonus = 0.5 * (1 - (Math.E ** (-0.5 * x))) // 睡眠時間ボーナス
  const amount = Math.floor((base + parseFloat(bonus.toFixed(3))) * 1000);
  return { sleepDuration, amount };
}

/**
 * 入力のbigintを 0.001 MATIC として解釈し、 1 MATIC 単位に変換する
 * @param bigInt 0.001 MATIC
 */
export function bigint2Float(bigInt: bigint): number {
  const isNeg = bigInt < BigInt(0);
  const abs = bigInt * BigInt(isNeg ? -1 : 1);
  const base = abs / BigInt(1000);
  const float = abs - (base * BigInt(1000));
  const floatStr = float.toString().padStart(3, '0');
  const str = `${isNeg ? '-' : ''}${base}.${floatStr}`;
  return parseFloat(str);
}
