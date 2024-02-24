'use client'
import { useRef, useState, useEffect } from "react"

const Dialog = () => {
  const [amount, setAmount] = useState(10)
  const [currentAmount, setCurrentAmount] = useState(10)
  const [tableData, setTableData] = useState<{ date: string; count: number; }[]>([]);
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    // ダミーデータを生成
    const data = Array.from({ length: 10 }, () => ({
      date: new Date().toISOString().split('T')[0],
      count: Math.floor(Math.random() * 100) + 1,
    }));
    setTableData(data);
  }, []);

  const openHandler = () => {
    dialog.current?.showModal()
    setAmount(currentAmount)
  }

  const cancelHandler = () => {
    dialog.current?.close()
  }

  const closeHandler = () => {
    dialog.current?.close()
    setCurrentAmount(currentAmount - amount)
  }

  return (
    <>
      <h2 className="text-center mt-3">取引履歴</h2>
      {/* <details>
        <summary className="text-center">過去の取引</summary> */}
        <div className="overflow-auto max-h-48 lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto p-4">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-white px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  日付
                </th>
                <th className="text-white px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  個数
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* </details> */}
      <dialog className="bg-white p-5 rounded-lg shadow-lg text-center" ref={dialog}>
        <button onClick={cancelHandler} type="button"
        className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 p-2 rounded-full font-bold text-white">
          X
        </button>
        <div className="mt-4">
          <p>受け取り先</p>
          <input type="text" className="w-2/4 p-3 rounded-lg border" placeholder="123456789" />
          <p>受け取り額</p>
          <input type="number" className="w-2/4 p-3 rounded-lg border" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
          <button onClick={closeHandler} type="button" className="bg-blue-500 p-3 rounded-full font-bold text-white mt-4 hover:bg-blue-700 transition duration-300">
            {amount} MATIC受け取る
          </button>
        </div>
      </dialog>
      <h2 className="text-center">売り出し中: {currentAmount} MATIC</h2>
      <h2 className="text-center">もらえる金額: {currentAmount} MATIC</h2>
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
