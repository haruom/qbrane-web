'use client'
import { bigint2Float } from "@/lib/reward/reward"
import { RecordEventType } from "@prisma/client"
import { useRef, useState } from "react"
import { MetaMaskProvider, useSDK } from "@metamask/sdk-react";

const chainId = process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID;

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
  const buttonClass = "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded";
  const { sdk, connected, connecting, provider, account } = useSDK();
  console.info({ sdk, connected, connecting, provider, chainId })
  const addNetwork = async () => {
    if (!provider?.isConnected()) { await sdk?.connect() }

    await provider?.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId,
        chainName: 'Polygon Amoy Testnet',
        rpcUrls: ['https://rpc-amoy.polygon.technology/'],
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        blockExplorerUrls: ['https://www.oklink.com/amoy'],
      }],
    })
    await provider?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    })
  }

  const [userAddress, setUserAddress] = useState(account ?? '')
  const requestAccount = async () => {
    if (!provider?.isConnected()) { await sdk?.connect() }
    await provider?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    })
    const accounts = await provider?.request({
      method: 'eth_requestAccounts'
    }) as string[];

    if (!accounts || accounts?.length <= 0) {
      alert('アカウントを指定してください');
      throw 'error';
    }

    setUserAddress(accounts[0]);
  };

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
      <div className="flex flex-col justify-center px-3">
        <p className="text-center text-red-700">※デモのため、受け取りにはPolygon Amoy Testnetのアカウントが必要です</p>
        <button
          className={buttonClass}
          onClick={addNetwork}>Polygon Amoy Testnetをウォレットに追加</button>
      </div>
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
          <div className="flex px-10">
            <input type="text" className="grow w-2/4 p-3 rounded-lg border" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder="0x..." />
            <button className={buttonClass + ' shrink'} onClick={requestAccount}>
              👛
            </button>
          </div>
          <p>受け取り額</p>
          <div className="flex px-10">
            <input type="number" className="grow w-2/4 p-3 rounded-lg border" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
          </div>
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

const Dialog_ = (props: Props) => (
  <MetaMaskProvider
    sdkOptions={{
      dappMetadata: {
        name: 'SleePIN',
        url: process.env.NEXT_PUBLIC_APP_URL,
      }
    }}
    >
      <Dialog {...props}></Dialog>
  </MetaMaskProvider>
)
export default Dialog_
