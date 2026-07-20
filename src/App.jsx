import React, { useState } from 'react';
import { isConnected, requestAccess } from '@stellar/freighter-api';
import albedo from '@albedo-link/intent';

import Navbar from './components/Navbar';
import SearchBox from './components/SearchBox';
import Marketplace from './components/Marketplace';
import WalletModal from './components/WalletModal';
import useKns from './hooks/useKns';

function App() {
  const [wallet, setWallet] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); 
  const [network, setNetwork] = useState('testnet'); // 'testnet' | 'publicnet'

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleWalletSelect = async (type) => {
    setIsWalletModalOpen(false);
    
    if (type === 'freighter') {
      if (await isConnected()) {
        const pubKey = await requestAccess();
        setWallet(pubKey);
        setWalletType('freighter');
      } else {
        alert('Freighter extension not found.');
      }
    } else if (type === 'albedo') {
      try {
        const res = await albedo.publicKey();
        setWallet(res.pubkey);
        setWalletType('albedo');
      } catch (e) {
        console.error(e);
      }
    } else if (type === 'rabet') {
      if (window.rabet) {
        try {
          const res = await window.rabet.connect();
          setWallet(res.publicKey);
          setWalletType('rabet');
        } catch (e) {
          console.error(e);
        }
      } else {
        alert('Rabet extension not found.');
      }
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setWalletType(null);
  };

  const { registerDomain, redeemDomain, txStatus, errorMessage, txHash, resetTx } = useKns(wallet, walletType, network);

  const handleAction = async (action, domain) => {
    if (!wallet) return setIsWalletModalOpen(true);
    
    const [name, tld] = domain.split('.');
    
    if (action === 'register') {
      await registerDomain(name, '.' + tld);
    } else if (action === 'redeem') {
      await redeemDomain(name, '.' + tld);
    }
  };

  return (
    <div className="container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        wallet={wallet} 
        connectWallet={() => setIsWalletModalOpen(true)} 
        disconnectWallet={disconnectWallet}
        network={network}
        setNetwork={setNetwork}
      />

      <main className="main-content">
        {activeTab === 'search' && <SearchBox handleAction={handleAction} txStatus={txStatus} errorMessage={errorMessage} txHash={txHash} network={network} resetTx={resetTx} />}
        {activeTab === 'market' && network === 'testnet' && <Marketplace handleAction={handleAction} txStatus={txStatus} />}
      </main>

      <footer className="app-footer mono">
        KALE Name Service (KNS) is a decentralized naming system built on Stellar Soroban.<br/>
        Secure your on-chain identity with .kale, .farm, .fun, .kalien, or custom extensions.
      </footer>

      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        onSelect={handleWalletSelect} 
      />
    </div>
  );
}

export default App;
