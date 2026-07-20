import React from 'react';

export default function Marketplace({ handleAction, txStatus }) {
  const renderAction = (domain) => {
    if (txStatus === 'waiting') return <span className="text-yellow" style={{fontSize: '0.8rem'}}>Signing...</span>;
    if (txStatus === 'confirming') return <span className="text-yellow" style={{fontSize: '0.8rem'}}>Confirming...</span>;
    if (txStatus === 'success') return <span className="text-green" style={{fontSize: '0.8rem'}}>Success!</span>;
    return <button className="btn-action mono" onClick={() => handleAction('redeem', domain)}>Redeem</button>;
  };

  return (
    <div className="marketplace-container">
      <div className="list-header mono">
        <div>DOMAIN</div>
        <div>ASK</div>
      </div>
      
      <div className="list-row">
        <div className="col-domain mono">halo.kale</div>
        <div className="col-price mono">
          500 KALE
          {renderAction('halo.kale')}
        </div>
      </div>
      
      <div className="list-row">
        <div className="col-domain mono">satoshi.kalien</div>
        <div className="col-price mono">
          5000 KALE
          {renderAction('satoshi.kalien')}
        </div>
      </div>

      <div className="list-row">
        <div className="col-domain mono">boss.farm</div>
        <div className="col-price mono">
          1200 KALE
          {renderAction('boss.farm')}
        </div>
      </div>
    </div>
  );
}
