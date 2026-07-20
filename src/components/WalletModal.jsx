import React from 'react';

export default function WalletModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="mono">Connect Wallet</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="wallet-options">
          <button className="wallet-option" onClick={() => onSelect('freighter')}>
            <span className="wallet-name">Freighter</span>
            <span className="wallet-desc">Browser Extension</span>
          </button>
          
          <button className="wallet-option" onClick={() => onSelect('albedo')}>
            <span className="wallet-name">Albedo</span>
            <span className="wallet-desc">Web / Mobile</span>
          </button>

          <button className="wallet-option" onClick={() => onSelect('rabet')}>
            <span className="wallet-name">Rabet</span>
            <span className="wallet-desc">Browser Extension</span>
          </button>
        </div>
      </div>
    </div>
  );
}
