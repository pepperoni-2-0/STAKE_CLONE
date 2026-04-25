import { useState, useCallback } from "react";
import "./RPS.css";
import { useWallet } from "../../context/WalletContext";

const MULTIPLIER = 2.94;

const RockIcon = () => (
  <svg viewBox="0 0 100 100" className="rps-icon">
    <defs>
      <linearGradient id="rockGrad" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#cbd5e0" />
        <stop offset="50%" stopColor="#718096" />
        <stop offset="100%" stopColor="#2d3748" />
      </linearGradient>
      <filter id="rockGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path d="M50 10 L75 30 L85 60 L60 90 L30 85 L15 60 L25 25 Z" fill="url(#rockGrad)" stroke="#1a202c" strokeWidth="2" filter="url(#rockGlow)" />
    <path d="M50 10 L60 45 L75 30" fill="#a0aec0" opacity="0.4" />
    <path d="M60 45 L85 60 L60 90 Z" fill="#2d3748" opacity="0.6" />
    <path d="M60 45 L60 90 L30 85 Z" fill="#4a5568" opacity="0.5" />
    <path d="M50 10 L25 25 L30 50 L60 45 Z" fill="#e2e8f0" opacity="0.3" />
    <path d="M30 50 L15 60 L30 85 Z" fill="#1a202c" opacity="0.5" />
    <path d="M50 10 L60 45 L30 50 Z" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
    <path d="M60 45 L60 90" fill="none" stroke="#2d3748" strokeWidth="1" />
    <path d="M30 50 L30 85" fill="none" stroke="#1a202c" strokeWidth="1" />
  </svg>
);

const PaperIcon = () => (
  <svg viewBox="0 0 100 100" className="rps-icon">
    <defs>
      <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbd38d" />
        <stop offset="50%" stopColor="#d69e2e" />
        <stop offset="100%" stopColor="#975a16" />
      </linearGradient>
    </defs>
    <path d="M25 15 Q35 5 45 15 L75 15 L75 80 Q65 90 55 80 L25 80 Z" fill="url(#paperGrad)" stroke="#a0aec0" strokeWidth="2" filter="drop-shadow(2px 4px 6px rgba(0,0,0,0.3))" />
    <path d="M25 15 L35 25 L35 90 L25 80 Z" fill="#cbd5e0" />
    <line x1="40" y1="35" x2="65" y2="35" stroke="#a0aec0" strokeWidth="3" strokeLinecap="round" />
    <line x1="40" y1="50" x2="60" y2="50" stroke="#a0aec0" strokeWidth="3" strokeLinecap="round" />
    <line x1="40" y1="65" x2="65" y2="65" stroke="#a0aec0" strokeWidth="3" strokeLinecap="round" />
    <circle cx="65" cy="70" r="10" fill="url(#goldGrad)" stroke="#744210" strokeWidth="1" />
    <circle cx="65" cy="70" r="7" fill="none" stroke="#f6e05e" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

const ScissorsIcon = () => (
  <svg viewBox="0 0 100 100" className="rps-icon">
    <defs>
      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="50%" stopColor="#a0aec0" />
        <stop offset="100%" stopColor="#4a5568" />
      </linearGradient>
      <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f56565" />
        <stop offset="100%" stopColor="#c53030" />
      </linearGradient>
    </defs>
    {}
    <path d="M40 55 L85 15 Q90 10 95 15 L45 60 Z" fill="url(#bladeGrad)" stroke="#2d3748" strokeWidth="1" filter="drop-shadow(2px 2px 3px rgba(0,0,0,0.4))" />
    <path d="M40 55 L85 15 L88 20 L45 60 Z" fill="#ffffff" opacity="0.4" />
    
    {}
    <path d="M60 55 L15 15 Q10 10 5 15 L55 60 Z" fill="url(#bladeGrad)" stroke="#2d3748" strokeWidth="1" filter="drop-shadow(2px 2px 3px rgba(0,0,0,0.4))" />
    <path d="M60 55 L15 15 L12 20 L55 60 Z" fill="#ffffff" opacity="0.4" />
    
    {}
    <path d="M45 60 L35 75 A15 15 0 1 0 45 95 A15 15 0 0 0 55 80 Z" fill="url(#handleGrad)" stroke="#742a2a" strokeWidth="2" filter="drop-shadow(1px 3px 5px rgba(0,0,0,0.5))" />
    <circle cx="35" cy="85" r="8" fill="#1a202c" stroke="#4a5568" strokeWidth="2" />
    
    {}
    <path d="M55 60 L65 75 A15 15 0 1 1 55 95 A15 15 0 0 1 45 80 Z" fill="url(#handleGrad)" stroke="#742a2a" strokeWidth="2" filter="drop-shadow(1px 3px 5px rgba(0,0,0,0.5))" />
    <circle cx="65" cy="85" r="8" fill="#1a202c" stroke="#4a5568" strokeWidth="2" />
    
    {}
    <circle cx="50" cy="58" r="4" fill="#a0aec0" stroke="#2d3748" strokeWidth="1" />
    <line x1="48" y1="56" x2="52" y2="60" stroke="#2d3748" strokeWidth="1" />
  </svg>
);

const OPTIONS = ["rock", "paper", "scissors"];

export default function RPS() {
  const [status, setStatus] = useState("idle");
  const [bet, setBet] = useState(100);
  const [choice, setChoice] = useState("rock");
  const [houseChoice, setHouseChoice] = useState(null);
  const [winAmount, setWinAmount] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [currentBetId, setCurrentBetId] = useState(null);

  const { balance, placeBet, updateBetOutcome, setShowDepositModal } = useWallet();

  const potentialWin = (bet * MULTIPLIER).toFixed(2);

  const determineOutcome = (player, house) => {
    if (player === house) return "tie";
    if (
      (player === "rock" && house === "scissors") ||
      (player === "paper" && house === "rock") ||
      (player === "scissors" && house === "paper")
    ) {
      return "win";
    }
    return "loss";
  };

  const startGame = useCallback(() => {
    if (bet <= 0 || isRevealing) return;
    if (balance < bet) {
      setShowDepositModal(true);
      return;
    }

    const betId = placeBet(bet, "Casino", "RPS Duel");
    if (!betId) return;

    setCurrentBetId(betId);
    setIsRevealing(true);
    setStatus("playing");
    setHouseChoice(null);
    setWinAmount(0);

    setTimeout(() => {
      const houseRnd = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
      setHouseChoice(houseRnd);
      
      const outcome = determineOutcome(choice, houseRnd);
      
      if (outcome === "win") {
        const win = +(bet * MULTIPLIER).toFixed(2);
        setStatus("won");
        setWinAmount(win);
        updateBetOutcome(betId, win, MULTIPLIER, "won");
      } else if (outcome === "tie") {
        setStatus("tie");
        setWinAmount(bet);
        updateBetOutcome(betId, bet, 1, "won"); 
      } else {
        setStatus("lost");
        updateBetOutcome(betId, 0, 0, "lost");
      }
      setIsRevealing(false);
    }, 2000);
  }, [bet, choice, isRevealing, balance, placeBet, updateBetOutcome]);

  const resetGame = useCallback(() => {
    setStatus("idle");
    setHouseChoice(null);
    setWinAmount(0);
    setIsRevealing(false);
  }, []);

  const halfBet = () => setBet(prev => Math.max(1, Math.floor(prev / 2)));
  const doubleBet = () => setBet(prev => prev * 2);

  const renderIcon = (type) => {
    if (type === "rock") return <RockIcon />;
    if (type === "paper") return <PaperIcon />;
    if (type === "scissors") return <ScissorsIcon />;
    return <div className="rps-unknown">?</div>;
  };

  return (
    <div className="rps-root">
      <div className="rps-game">
        <aside className="rps-sidebar">
          <div className="rps-logo">
            <img src="/assets/rps.png" alt="RPS Logo" className="rps-brand-icon" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <h2>RPS Duel</h2>
          </div>

          <div className="rps-field">
            <label>Bet Amount</label>
            <div className="rps-input-wrap">
              <span className="currency">$</span>
              <input
                type="number"
                min="1"
                value={bet}
                onChange={e => setBet(Math.max(0, Number(e.target.value)))}
                disabled={isRevealing}
              />
            </div>
            <div className="rps-quick-btns">
              <button onClick={halfBet} disabled={isRevealing}>½</button>
              <button onClick={doubleBet} disabled={isRevealing}>2×</button>
              <button onClick={() => setBet(100)} disabled={isRevealing}>100</button>
              <button onClick={() => setBet(500)} disabled={isRevealing}>500</button>
            </div>
          </div>

          <div className="rps-field rps-choice-field">
            <label>Your Choice</label>
            <div className="rps-choice-btns">
              <button 
                className={choice === "rock" ? "selected" : ""} 
                onClick={() => setChoice("rock")}
                disabled={isRevealing}
              >
                Rock
              </button>
              <button 
                className={choice === "paper" ? "selected" : ""} 
                onClick={() => setChoice("paper")}
                disabled={isRevealing}
              >
                Paper
              </button>
              <button 
                className={choice === "scissors" ? "selected" : ""} 
                onClick={() => setChoice("scissors")}
                disabled={isRevealing}
              >
                Scissors
              </button>
            </div>
          </div>

          <div className="rps-stats">
            <div className="rps-stat-row">
              <span className="label">Multiplier</span>
              <span className="value amber">{MULTIPLIER}×</span>
            </div>
            <div className="rps-stat-row">
              <span className="label">Potential Win</span>
              <span className="value green">${status === "idle" ? potentialWin : winAmount.toFixed(2)}</span>
            </div>
          </div>

          {!isRevealing && status !== "won" && status !== "lost" && status !== "tie" ? (
            <button className="rps-btn-primary bet rps-glowy-button" onClick={startGame} disabled={bet <= 0}>
              <span className="btn-text">PLAY</span>
              <div className="btn-glow-effect"></div>
            </button>
          ) : isRevealing ? (
            <button className="rps-btn-primary disabled" disabled>
              BATTLING...
            </button>
          ) : (
            <button className="rps-btn-primary bet rps-glowy-button" onClick={resetGame}>
              <span className="btn-text">PLAY AGAIN</span>
              <div className="btn-glow-effect"></div>
            </button>
          )}
        </aside>

        <section className="rps-board-area">
          {status === "won" && (
            <div className="rps-result-overlay">
              <div className="rps-result-banner win">
                You Won!
                <span className="amount">${winAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
          {status === "tie" && (
            <div className="rps-result-overlay">
              <div className="rps-result-banner tie">
                Draw!
                <span className="amount">Bet Refunded</span>
              </div>
            </div>
          )}
          {status === "lost" && (
            <div className="rps-result-overlay">
              <div className="rps-result-banner loss">
                You Lost!
                <span className="amount">$0.00</span>
              </div>
            </div>
          )}

          <div className="rps-duel-container">
            <div className="rps-player-side">
              <div className="rps-label">YOU</div>
              <div className={`rps-card ${isRevealing ? 'shaking' : ''}`}>
                {renderIcon(choice)}
              </div>
            </div>

            <div className="rps-vs">VS</div>

            <div className="rps-player-side">
              <div className="rps-label">HOUSE</div>
              <div className={`rps-card ${isRevealing ? 'shaking' : ''}`}>
                {isRevealing ? <div className="rps-unknown">?</div> : houseChoice ? renderIcon(houseChoice) : <div className="rps-unknown">?</div>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
