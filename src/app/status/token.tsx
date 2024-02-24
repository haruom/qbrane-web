'use client'
import { useRef,useState } from "react"
import Image from "next/image"

const Dialog = () => {
  const [amount, setAmount] = useState(10)
  const [currentamount, setCurrentAmount] = useState(10)
  const dialog = useRef<HTMLDialogElement>(null)
  const openHandler = () => {
    dialog.current?.showModal()
    setAmount(currentamount)
  }
  const cancelHandler = () => {
    dialog.current?.close()
  }

  const closeHandler = () => {
    dialog.current?.close()
    setCurrentAmount(currentamount - amount)
  }

  return (
    <>
    <Image src="/SleepinWhite.svg" alt="sleepin white" className="m-5" width={100} height={100} />
    <div className="h-5"></div>
    <h2 className="text-center">売り出し中: {currentamount}MATIC</h2>
    <h2 className="text-center">もらえる金額: {currentamount}MATIC</h2>
    {/* テーブル追加 */}
    <dialog className="bg-white p-5 rounded-lg shadow-lg text-center" ref={dialog}>
    <button onClick={cancelHandler} type="button"
    className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 p-2 rounded-full font-bold text-white">
    X
    </button>
    <p>受け取り先</p>
    <input type="text" className="w-2/4 p-3 rounded-lg border" placeholder="123456789" />
    <p>受け取り額</p>
    <input type="number" className="w-2/4 p-3 rounded-lg border" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
    <button onClick={closeHandler} type="button" className="bg-blue-500 p-3 rounded-full font-bold text-white mt-4 hover:bg-blue-700 transition duration-300">
      {amount} MATIC受け取る
    </button>
    </dialog>
    <div className="text-center mt-10">
    <button type="button" 
    className = 'bg-blue-500 p-3 rounded-full font-bold text-white hover:bg-blue-700 transition duration-300'
    onClick={openHandler}>
      受け取る
    </button>
    </div>
    
    </>
  )
}

export default Dialog

