import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BetSlip({ bets, onRemoveBet, onClearAll }) {
  const [stake, setStake] = useState('')

  const betList = Object.values(bets)
  const totalOdds = betList.reduce((acc, b) => acc * b.odds, 1)
  const stakeNum = parseFloat(stake) || 0
  const payout = stakeNum * totalOdds

  return (
    <div className="betslip-wrapper">
      <motion.div
        className="betslip"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >

        <div className="betslip-header">
          <div className="betslip-title">
            <span>🎫</span>
            Bet Slip
            {betList.length > 0 && (
              <motion.span
                className="betslip-count"
                key={betList.length}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {betList.length}
              </motion.span>
            )}
          </div>
          {betList.length > 0 && (
            <button
              className="bet-card-remove"
              onClick={onClearAll}
              title="Clear all"
              style={{ fontSize: '12px', color: '#ed4163' }}
            >
              Clear
            </button>
          )}
        </div>


        <div className="betslip-body">
          {betList.length === 0 ? (
            <div className="betslip-empty">
              <div className="betslip-empty-icon">📋</div>
              <p>No selections yet</p>
              <p style={{ fontSize: '11px', marginTop: '4px', opacity: 0.6 }}>
                Click on odds to add bets
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {betList.map((bet) => (
                <motion.div
                  key={bet.id}
                  className="bet-card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  layout
                >
                  <div className="bet-card-header">
                    <span className="bet-card-match">{bet.match}</span>
                    <button
                      className="bet-card-remove"
                      onClick={() => onRemoveBet(bet.id)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="bet-card-selection">{bet.selection}</div>
                  <div className="bet-card-odds">{Number(bet.odds).toFixed(2)}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>


        {betList.length > 0 && (
          <motion.div
            className="betslip-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stake-input-group">
              <span className="stake-currency">₹</span>
              <input
                className="stake-input"
                type="number"
                placeholder="Enter stake..."
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                min="0"
                id="stake-input"
              />
            </div>

            <div className="betslip-summary">
              <div className="betslip-row">
                <span className="betslip-row-label">Total Odds</span>
                <span className="betslip-row-value">{totalOdds.toFixed(2)}</span>
              </div>
              <div className="betslip-row">
                <span className="betslip-row-label">Potential Payout</span>
                <span className="betslip-row-value payout">
                  ₹{payout.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="place-bet-btn"
              disabled={stakeNum <= 0}
              id="place-bet-btn"
            >
              Place Bet
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
