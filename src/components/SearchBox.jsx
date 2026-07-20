import React, { useState } from 'react';

export default function SearchBox({ handleAction, txStatus, errorMessage, txHash, network, resetTx }) {
  const [query, setQuery] = useState('');
  const [tld, setTld] = useState('.kale');
  const [customExt, setCustomExt] = useState('');

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onRegisterClick();
    }
  };

  const onRegisterClick = () => {
    if (query.length < 3) return;
    if (tld === 'custom') {
      if (customExt.length < 3 || customExt.length > 5) return;
      handleAction('register', `${query}.${customExt}`);
    } else {
      handleAction('register', `${query}${tld}`);
    }
  };

  return (
    <div className="search-wrapper">
      <div className="giant-input-container">
        <input 
          type="text" 
          className="giant-input mono" 
          placeholder="search" 
          value={query}
          onChange={(e) => {
             setQuery(e.target.value.toLowerCase());
             if (txStatus !== 'idle') resetTx();
          }}
          onKeyDown={onKeyDown}
          spellCheck="false"
          autoComplete="off"
        />
        <select 
          className="giant-select mono" 
          value={tld} 
          onChange={(e) => {
             setTld(e.target.value);
             if (txStatus !== 'idle') resetTx();
          }}
        >
          <option value=".kale">.kale</option>
          <option value=".farm">.farm</option>
          <option value=".fun">.fun</option>
          <option value=".kalien">.kalien</option>
          <option value=".farmer">.farmer</option>
          <option value="custom">{tld === 'custom' ? '.' : 'Custom...'}</option>
        </select>
        {tld === 'custom' && (
          <input 
            type="text" 
            className="giant-input mono" 
            placeholder="ext" 
            value={customExt}
            style={{ width: '150px', marginLeft: '10px' }}
            onChange={(e) => {
               // only allow a-z
               const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
               if (val.length <= 5) {
                 setCustomExt(val);
               }
               if (txStatus !== 'idle') resetTx();
            }}
            onKeyDown={onKeyDown}
            spellCheck="false"
            autoComplete="off"
          />
        )}
      </div>
      <div className="search-hint mono" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        <div>
           press <span onClick={onRegisterClick} style={{cursor: 'pointer', color: 'var(--accent-color)'}}>enter</span> to register 
           <span style={{ color: 'var(--text-secondary)', marginLeft: '10px' }}>
             (Cost: {tld === 'custom' ? '1500 KALE' : '1000 KALE'})
           </span>
        </div>
        
        {txStatus !== 'idle' && (
          <div style={{ fontSize: '0.9rem' }}>
            {txStatus === 'waiting' && <span className="text-yellow">Waiting for wallet signature...</span>}
            {txStatus === 'confirming' && <span className="text-yellow">Confirming on-chain...</span>}
            {txStatus === 'success' && (
              <a 
                href={txHash ? `https://stellar.expert/explorer/${network === 'testnet' ? 'testnet' : 'public'}/tx/${txHash}` : '#'}
                target={txHash ? "_blank" : undefined} rel="noreferrer"
                className="text-green"
                style={{ textDecoration: txHash ? 'underline' : 'none' }}
              >
                Transaction Success! {txHash ? '(View Tx)' : ''}
              </a>
            )}
            
            {txStatus === 'error' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span className="text-red" style={{ wordBreak: 'break-word' }}>{errorMessage}</span>
                {txHash && (
                  <a 
                    href={`https://stellar.expert/explorer/${network === 'testnet' ? 'testnet' : 'public'}/tx/${txHash}`}
                    target="_blank" rel="noreferrer"
                    style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}
                  >
                    [ view on stellar.expert ]
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
