import React, { createContext, useState, useContext, useEffect } from 'react';

const WalletContext = createContext();

const getKey = (email, suffix) => email ? `${suffix}_${email}` : null;

export const WalletProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('nexus_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const email = user?.email || null;

  const [balance, setBalance] = useState(() => {
    if (!email) return 0;
    const saved = localStorage.getItem(getKey(email, 'wallet_balance'));
    return saved !== null ? parseFloat(saved) : 0;
  });

  const [betHistory, setBetHistory] = useState(() => {
    if (!email) return [];
    try {
      const saved = localStorage.getItem(getKey(email, 'bet_history'));
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [showDepositModal, setShowDepositModal] = useState(false);

  // When user changes (login/logout), reload that user's wallet data
  useEffect(() => {
    if (!user?.email) {
      setBalance(0);
      setBetHistory([]);
      return;
    }
    const bKey = getKey(user.email, 'wallet_balance');
    const hKey = getKey(user.email, 'bet_history');

    const savedBalance = localStorage.getItem(bKey);
    setBalance(savedBalance !== null ? parseFloat(savedBalance) : 0);

    try {
      const savedHistory = localStorage.getItem(hKey);
      setBetHistory(savedHistory ? JSON.parse(savedHistory) : []);
    } catch { setBetHistory([]); }
  }, [user?.email]);

  // Persist balance (only if logged in)
  useEffect(() => {
    if (!email) return;
    localStorage.setItem(getKey(email, 'wallet_balance'), balance.toString());
  }, [balance, email]);

  // Persist bet history (only if logged in)
  useEffect(() => {
    if (!email) return;
    localStorage.setItem(getKey(email, 'bet_history'), JSON.stringify(betHistory));
  }, [betHistory, email]);

  const login = (username, loginEmail) => {
    const userData = { username, email: loginEmail };
    localStorage.setItem('nexus_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('nexus_user');
    setUser(null);
  };

  const addBalance = (amount) => {
    if (!user) return; // Must be logged in
    setBalance(prev => prev + amount);
  };

  const deductBalance = (amount) => {
    if (!user) return false; // Must be logged in
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  const placeBet = (amount, type, game) => {
    if (!user) return null; // Must be logged in
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
      user,
      login,
      logout,
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
