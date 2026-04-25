import { useState, useCallback, useEffect } from "react";
import "./WhackAMole.css";
import { useWallet } from "../../context/WalletContext";

const HOLES = 6;
const MOLES_COUNT = 3;

const HoleIcon = () => (
  <svg viewBox="0 0 100 40" className="wam-hole-svg">
    <ellipse cx="50" cy="20" rx="45" ry="15" fill="#111" stroke="#333" strokeWidth="3" />
    <ellipse cx="50" cy="23" rx="40" ry="10" fill="#050505" />
  </svg>
);

const MoleIcon = () => (
  <svg viewBox="0 0 100 100" className="wam-mole-svg">
    <path d="M20,100 C20,40 40,20 50,20 C60,20 80,40 80,100 Z" fill="#8B4513" />
    <path d="M30,100 C30,50 45,35 50,35 C55,35 70,50 70,100 Z" fill="#A0522D" />
    <circle cx="40" cy="45" r="4" fill="#000" />
    <circle cx="60" cy="45" r="4" fill="#000" />
    <circle cx="50" cy="55" r="5" fill="#FFC0CB" />
    <path d="M45,55 L30,52 M45,57 L30,60 M55,55 L70,52 M55,57 L70,60" stroke="#000" strokeWidth="1.5" />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 100 100" className="wam-cross-svg">
    <line x1="25" y1="25" x2="75" y2="75" stroke="#ff5252" strokeWidth="12" strokeLinecap="round" />
    <line x1="75" y1="25" x2="25" y2="75" stroke="#ff5252" strokeWidth="12" strokeLinecap="round" />
  </svg>
);

const HammerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4h5v5l-5-5z" fill="#aaa" />
    <path d="M14.5 5.5l-11 11a2.12 2.12 0 0 0 3 3l11-11" stroke="#8B4513" fill="#8B4513" />
    <path d="M16 2l6 6-4 4-6-6 4-4z" fill="#ddd" />
  </svg>
);

export default function WhackAMole() {
  const [status, setStatus] = useState("idle");
  const [bet, setBet] = useState(100);
  const [winAmount, setWinAmount] = useState(0);
  
  const [molesPositions, setMolesPositions] = useState([]);
  const [revealedIndex, setRevealedIndex] = useState(null);
  const [hits, setHits] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentBetId, setCurrentBetId] = useState(null);

  const { balance, placeBet, updateBetOutcome, setShowDepositModal } = useWallet();

  const isPlaying = status === "playing";
  const isFinished = status === "lost" || status === "cashed";
  
  const currentMultiplier = hits === 0 ? 1.0 : Math.pow(1.96, hits);
  const nextMultiplier = Math.pow(1.96, hits + 1);
  const potentialWin = (bet * currentMultiplier).toFixed(2);
  const randomizeMoles = useCallback(() => {
    const positions = [];
    while (positions.length < MOLES_COUNT) {
      const r = Math.floor(Math.random() * HOLES);
      if (!positions.includes(r)) positions.push(r);
    }
    setMolesPositions(positions);
  }, []);

  const startGame = useCallback(() => {
    if (bet <= 0) return;
    if (balance < bet) {
      setShowDepositModal(true);
      return;
    }

    const betId = placeBet(bet, "Casino", "Whack-A-Mole");
    if (!betId) return;

    setCurrentBetId(betId);
    randomizeMoles();
    setRevealedIndex(null);
    setHits(0);
    setWinAmount(0);
    setIsAnimating(false);
    setStatus("playing");
  }, [bet, randomizeMoles, balance, placeBet]);

  const handleHoleClick = useCallback((index) => {
    if (!isPlaying || isAnimating || revealedIndex !== null) return;
    
    setRevealedIndex(index);
    setIsAnimating(true);

    const isMole = molesPositions.includes(index);

    if (isMole) {
      setTimeout(() => {
        setHits(prev => prev + 1);
        setRevealedIndex(null);
        randomizeMoles();
        setIsAnimating(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setStatus("lost");
        setWinAmount(0);
        setIsAnimating(false);
        updateBetOutcome(currentBetId, 0, 0, "lost");
      }, 1000);
    }
  }, [isPlaying, isAnimating, revealedIndex, molesPositions, randomizeMoles, currentBetId, updateBetOutcome]);

  const cashOut = useCallback(() => {
    if (!isPlaying || hits === 0 || isAnimating) return;
    const win = +(bet * currentMultiplier).toFixed(2);
    setStatus("cashed");
    setWinAmount(win);
    updateBetOutcome(currentBetId, win, currentMultiplier, "won");
    setRevealedIndex(null);
  }, [isPlaying, hits, bet, currentMultiplier, isAnimating, currentBetId, updateBetOutcome]);

  const resetGame = useCallback(() => {
    setMolesPositions([]);
    setRevealedIndex(null);
    setHits(0);
    setWinAmount(0);
    setIsAnimating(false);
    setStatus("idle");
  }, []);

  const halfBet = () => setBet(prev => Math.max(1, Math.floor(prev / 2)));
  const doubleBet = () => setBet(prev => prev * 2);

  return (
    <div className="wam-root">
      <div className="wam-game">
        <aside className="wam-sidebar">
          <div className="wam-logo">
            <img src="/assets/hammer.png" alt="Whack-A-Mole Logo" className="wam-brand-icon" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <h2>Whack-A-Mole</h2>
          </div>

          <div className="wam-field">
            <label>Bet Amount</label>
            <div className="wam-input-wrap">
              <span className="currency">₹</span>
              <input
                type="number"
                min="1"
                value={bet}
                onChange={e => setBet(Math.max(0, Number(e.target.value)))}
                disabled={isPlaying}
              />
            </div>
            <div className="wam-quick-btns">
              <button onClick={halfBet} disabled={isPlaying}>½</button>
              <button onClick={doubleBet} disabled={isPlaying}>2×</button>
              <button onClick={() => setBet(100)} disabled={isPlaying}>100</button>
              <button onClick={() => setBet(500)} disabled={isPlaying}>500</button>
            </div>
          </div>

          <div className="wam-stats">
            <div className="wam-stat-row">
              <span className="label">Total Hits</span>
              <span className="value white">{hits}</span>
            </div>
            <div className="wam-stat-row">
              <span className="label">Next Multiplier</span>
              <span className="value amber">{nextMultiplier.toFixed(2)}×</span>
            </div>
            <div className="wam-stat-row">
              <span className="label">Current Win</span>
              <span className="value green">₹{isPlaying || status === "idle" ? potentialWin : winAmount.toFixed(2)}</span>
            </div>
          </div>

          {!isPlaying ? (
            <button className="wam-btn-primary bet wam-glowy-button" onClick={startGame} disabled={bet <= 0}>
              <span className="btn-text">{isFinished ? "PLAY AGAIN" : "PLACE BET"}</span>
              <div className="btn-glow-effect"></div>
            </button>
          ) : (
            <button
              className={`wam-btn-primary cashout${hits > 0 && !isAnimating ? " active-glow" : ""}`}
              onClick={cashOut}
              disabled={hits === 0 || isAnimating}
            >
              CASH OUT — ₹{potentialWin}
            </button>
          )}

          {isFinished && (
            <button className="wam-btn-secondary" onClick={resetGame}>
              Reset
            </button>
          )}
        </aside>

        <section className="wam-board-area">
          {status === "lost" && (
            <div className="wam-result-overlay">
              <div className="wam-result-banner loss">
                Empty Hole!
                <span className="amount">₹0.00</span>
              </div>
            </div>
          )}
          {status === "cashed" && (
            <div className="wam-result-overlay">
              <div className="wam-result-banner cashout-banner">
                Cashed Out!
                <span className="amount">₹{winAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="wam-grid">
            {Array.from({ length: HOLES }).map((_, index) => {
              const isRevealed = revealedIndex === index;
              const isMole = isRevealed && molesPositions.includes(index);
              const isEmpty = isRevealed && !molesPositions.includes(index);

              return (
                <div key={index} className="wam-hole-container">
                  <div className="wam-hole-bg">
                    <HoleIcon />
                  </div>
                  
                  <div className={`wam-mole-wrap ${isMole ? "active" : ""}`}>
                    <MoleIcon />
                  </div>

                  <div className={`wam-empty-wrap ${isEmpty ? "active" : ""}`}>
                    <CrossIcon />
                  </div>

                  <button 
                    className={`wam-cover-btn ${isRevealed || (!isPlaying && status !== "idle") ? "revealed" : ""}`}
                    onClick={() => handleHoleClick(index)}
                    disabled={!isPlaying || isAnimating}
                  >
                    {!(isRevealed || (!isPlaying && status !== "idle")) && <span className="wam-question-mark">?</span>}
                  </button>
                  
                  <div className="wam-dirt-fg"></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
