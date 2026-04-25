import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import './BetHistory.css';

const BetHistory = () => {
  const { betHistory } = useWallet();
  const [activeTab, setActiveTab] = useState('All');

  const filteredHistory = activeTab === 'All' 
    ? betHistory 
    : betHistory.filter(bet => bet.type === activeTab);

  return (
    <div className="bet-history-container">
      <div className="bet-history-header">
        <div className="bet-history-tabs">
          <button 
            className={activeTab === 'All' ? 'active' : ''} 
            onClick={() => setActiveTab('All')}
          >
            All Bets
          </button>
          <button 
            className={activeTab === 'Casino' ? 'active' : ''} 
            onClick={() => setActiveTab('Casino')}
          >
            Casino
          </button>
          <button 
            className={activeTab === 'Sports' ? 'active' : ''} 
            onClick={() => setActiveTab('Sports')}
          >
            Sports
          </button>
        </div>
      </div>
      
      <div className="bet-history-table-wrapper">
        <table className="bet-history-table">
          <thead>
            <tr>
              <th>Game / Match</th>
              <th>Time</th>
              <th>Bet Amount</th>
              <th>Multiplier</th>
              <th>Payout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((bet) => (
                <tr key={bet.id}>
                  <td>
                    <div className="game-info">
                      <span className="game-type-badge">{bet.type}</span>
                      <span className="game-name">{bet.game}</span>
                    </div>
                  </td>
                  <td className="time-cell">{bet.time}</td>
                  <td>₹{bet.amount.toFixed(2)}</td>
                  <td>{bet.multiplier > 0 ? `${bet.multiplier.toFixed(2)}x` : '-'}</td>
                  <td className={bet.payout > 0 ? 'payout-win' : ''}>
                    ₹{bet.payout.toFixed(2)}
                  </td>
                  <td>
                    <span className={`status-badge ${bet.status}`}>
                      {bet.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-bets">No bets recorded yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetHistory;
