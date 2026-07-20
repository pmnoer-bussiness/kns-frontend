import React from 'react';

export default function Navbar({ activeTab, setActiveTab, wallet, connectWallet, disconnectWallet, network, setNetwork }) {
  return (
    <nav className="navbar">
      <a href="/" className="logo">KALE<span>.</span></a>
      
      <div className="nav-links">
        <button 
          className={`nav-link mono ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          [ resolve ]
        </button>
        {network === 'testnet' && (
          <button 
            className={`nav-link mono ${activeTab === 'market' ? 'active' : ''}`}
            onClick={() => setActiveTab('market')}
          >
            [ market ]
          </button>
        )}
        
        {wallet && (
          <button 
            className="nav-link mono text-red"
            onClick={disconnectWallet}
          >
            [ disconnect ]
          </button>
        )}

        <button 
          className={`wallet-btn mono ${wallet ? 'connected' : ''}`} 
          onClick={wallet ? undefined : connectWallet}
        >
          {wallet ? `${wallet.substring(0,4)}...${wallet.substring(wallet.length-4)}` : 'Connect'}
        </button>

        <button 
          className="nav-link mono" 
          onClick={() => {
            setNetwork(network === 'testnet' ? 'publicnet' : 'testnet');
            if (network === 'testnet' && activeTab === 'market') setActiveTab('search');
          }}
          style={{ color: network === 'testnet' ? '#fbbf24' : '#22c55e', borderColor: network === 'testnet' ? '#fbbf24' : '#22c55e' }}
        >
          [{network}]
        </button>
      </div>
    </nav>
  );
}
