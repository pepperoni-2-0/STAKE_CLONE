import React, { createContext, useState, useContext } from 'react';

const BetSlipContext = createContext();

export const BetSlipProvider = ({ children }) => {
  const [selectedBets, setSelectedBets] = useState({});

  const toggleBet = (bet) => {
    setSelectedBets(prev => {
      const newBets = { ...prev };
      if (newBets[bet.id]) {
        delete newBets[bet.id];
      } else {
        newBets[bet.id] = bet;
      }
      return newBets;
    });
  };

  const removeBet = (betId) => {
    setSelectedBets(prev => {
      const newBets = { ...prev };
      delete newBets[betId];
      return newBets;
    });
  };

  const clearAllBets = () => setSelectedBets({});

  return (
    <BetSlipContext.Provider value={{ selectedBets, toggleBet, removeBet, clearAllBets }}>
      {children}
    </BetSlipContext.Provider>
  );
};

export const useBetSlip = () => useContext(BetSlipContext);
