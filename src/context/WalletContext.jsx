import React, { createContext, useState, useContext, useEffect } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('wallet_balance');
    return saved !== null ? parseFloat(saved) : 0;
  });

  const [betHistory, setBetHistory] = useState(() => {
    const saved = localStorage.getItem('bet_history');
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('wallet_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('bet_history', JSON.stringify(betHistory));
  }, [betHistory]);

  const addBalance = (amount) => {
    setBalance(prev => prev + amount);
  };

  const deductBalance = (amount) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  const placeBet = (amount, type, game) => {
    if (deductBalance(amount)) {
      const newBet = {
        id: Date.now(),
        amount,
        type, 
        game,
        time: new Date().toLocaleTimeString(),
        multiplier: 0,
        payout: 0,
        status: 'pending' 
      };
      setBetHistory(prev => [newBet, ...prev].slice(0, 50)); 
      return newBet.id;
    }
    return null;
  };

  const updateBetOutcome = (id, payout, multiplier, status) => {
    setBetHistory(prev => prev.map(bet => 
      bet.id === id ? { ...bet, payout, multiplier, status } : bet
    ));
    if (payout > 0) {
      addBalance(payout);
    }
  };

  return (
    <WalletContext.Provider value={{ 
      balance, 
      betHistory, 
      addBalance, 
      deductBalance, 
      placeBet, 
      updateBetOutcome,
      showDepositModal,
      setShowDepositModal
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
