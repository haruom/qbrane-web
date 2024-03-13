'use client'
import { bigint2Float } from "@/lib/reward/reward"
import { RecordEventType } from "@prisma/client"
import { useRef, useState } from "react"

interface Record {
  type: RecordEventType
  amount: bigint
  sleepDuration: number | null
  sleepDate: Date | null
  recordedAt: Date
}
interface Props {
  records: Record[]
}
const Dialog = ({ records }: Props) => {
  const [amount, setAmount_] = useState(10)
  const setAmount = (v_: number) => {
    const v = Number.isNaN(v_) ? 0 : v_
    setAmount_(v);
  }
  const tableData = records.map(x => {
    const { type, amount: amount_, recordedAt } = x
    const amount = bigint2Float(amount_)

    switch (type) {
      case 'SELLDATA':
        return { date: recordedAt, detail: '睡眠データの売却', amount };
      case 'WITHDRAW':
        return { date: recordedAt, detail: '引き出し', amount };
      case 'SLEEP':
        if (!x.sleepDuration || !x.sleepDate) { throw '必要なデータが欠落しています'; }
        const hour = Math.floor(x.sleepDuration / 3600)
        const minute = Math.floor((x.sleepDuration - (hour * 3600)) / 60)
        const detail = `${hour}h${minute}m の睡眠`;
        return { date: x.sleepDate, detail, amount }
    }
  })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ date, ...rest }) => ({ date: date.toISOString().substring(0, 10), ...rest }))
  const dialog = useRef<HTMLDialogElement>(null)

  const openHandler = () => {
    dialog.current?.showModal()
    setAmount(amount)
  }

  const cancelHandler = () => {
    dialog.current?.close()
  }

  const closeHandler = () => {
    dialog.current?.close()
    location.reload()
  }

  return (
    <>
      <h2 className="text-center mt-3">取引履歴</h2>
      {/* <details>
        <summary className="text-center">過去の取引</summary> */}
      <div className="p-3">
        <div className="overflow-auto max-h-48 lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  日付
                </th>
                <th className="text-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  詳細
                </th>
                <th className="text-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  金額
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{row.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{row.detail}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{row.amount} MATIC</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* </details> */}
      <dialog className="bg-white p-5 rounded-lg shadow-lg text-center" ref={dialog}>
        <button onClick={cancelHandler} type="button"
          className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 p-2 rounded-full font-bold text-white">
          X
        </button>
        <div className="mt-4">
          <p>受け取り先</p>
          <input type="text" className="w-2/4 p-3 rounded-lg border" placeholder="0x..." />
          <p>受け取り額</p>
          <input type="number" className="w-2/4 p-3 rounded-lg border" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
          <button onClick={closeHandler} type="button" className="bg-blue-500 p-3 rounded-full font-bold text-white mt-4 hover:bg-blue-700 transition duration-300">
            {amount} MATIC受け取る
          </button>
        </div>
      </dialog>
      <div className="text-center m-3">
        <button type="button"
          className='bg-blue-500 p-3 rounded-full font-bold text-white hover:bg-blue-700 transition duration-300'
          onClick={openHandler}>
          受け取る
        </button>
      </div>
    </>
  )
}

export default Dialog
