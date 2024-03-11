"use client";
import React, { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { useSearchParams } from 'next/navigation';

export default function WalletInteraction() {
  const [account, setAccount] = useState('');
  const [hasProvider, setHasProvider] = useState(false);
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const amount = searchParams.get('amount');
  const maticId = "0x89"
  const testnetId = "0x13881"

  // Consolidate useEffects responsible for initial setup
  useEffect(() => {
    const init = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(!!provider);

      const savedAccount = localStorage.getItem('connectedAccount');
      if (savedAccount) setAccount(savedAccount);

      if (provider && savedAccount) {
        try {
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts.length > 0) setAccount(accounts[0]);
        } catch (error) {
          console.error("Error auto-connecting to MetaMask:", error);
        }
      }
    };
    init();
  }, []);

  // Simplify account effect for localStorage
  useEffect(() => {
    if (account) localStorage.setItem('connectedAccount', account);
  }, [account]);

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();
    if (!provider) return alert('Please install MetaMask to use this feature.');

    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) setAccount(accounts[0]);
      else alert('No accounts found. Make sure MetaMask is unlocked.');
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const sendTransaction = async () => {
    if (!account) return alert('Please connect to MetaMask first.');

    const provider = await detectEthereumProvider();
    if (!provider) return alert('Ethereum provider not found. Please install MetaMask.');

    try {
      // Returns the current price per gas in wei.
      const gasPrice = await provider.request({
        method: 'eth_gasPrice',
        params: [],
      });
      console.log('Gas Price:', gasPrice);
      console.log('parseInt(gasPrice, 16):', parseInt(gasPrice, 16));
      console.log('MATIC:', parseInt(gasPrice, 16) / (10 ** 18));
      // 0.00000001 MATIC

      const txParams = {
        from: account,
        to: '0x32cc368b24789d033d95a101da99667c6e94c4a2',
        value: '0x150000000000',
        gasPrice: '0x0',
      };

      const estimatedGas = await provider.request({
        method: 'eth_estimateGas',
        params: [txParams],
      });
      console.log('Estimated Gas:', estimatedGas);

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: '0x32cc368b24789d033d95a101da99667c6e94c4a2',
            value: '0x150000000000',
          }
        ],
      });

      // const txHash = await provider.request({
      //   method: 'eth_sendTransaction',
      //   params: [{ ...txParams, gasPrice: estimatedGas }],
      // });

      // console.log('Transaction Hash:', txHash);
      alert('Transaction sent. Check the console for the transaction hash.');
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Transaction failed. Check the console for more details.');
    }
  };

  const handleConnect = async () => {
    const provider = await detectEthereumProvider();
    if (!provider) return alert('Ethereum provider not found. Please install MetaMask.');

    try {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId:  testnetId}] });
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      console.log('Connected Account:', accounts[0]);
      if (accounts.length > 0){
        setAccount(accounts[0]);
        console.log('Connected Account:', accounts[0]);
      } 
    } catch (error) {
      console.error('Error switching chains or connecting:', error);
      if (error.code === 4902) alert('Chain not found. Please add it to MetaMask.');
      else alert(error.message);
    }
  };

  return (
    <>
      <a href="../" className="m-5">
        <img src="/Sleepin.svg" alt="sleepin" width={100} height={100} />
      </a>
      <h1 className="text-3xl text-center m-5">Order</h1>
      <div className="text-center m-3">
        <p>送金先アドレス</p>
        <p>データの期間: {startDate} 〜 {endDate}</p>
        <p>送金額: {amount} MATIC</p>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={sendTransaction} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px', border: '2px solid #4CAF50', borderRadius: '5px' }}>Send</button>
        <button onClick={handleConnect} style={{ padding: '10px 20px', fontSize: '16px', border: '2px solid #008CBA', borderRadius: '5px' }}>Switch</button>
      </div>
    </>
  );
}


// {account && <p style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', marginTop: '20px', border: '1px solid #ccc' }}>Connected Account: {account}</p>}
