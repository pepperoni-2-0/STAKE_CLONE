import { useState, useCallback } from "react";
import "./CoinToss.css";
import { useWallet } from "../../context/WalletContext";

const MULTIPLIER = 1.98;

const CoinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" fill="#cca141" stroke="#8d681b" />
    <path d="M12 8v8M9 11h6" stroke="#4a370b" />
  </svg>
);

export default function CoinToss() {
  const [status, setStatus] = useState("idle");
  const [bet, setBet] = useState(100);
  const [winAmount, setWinAmount] = useState(0);
  const [choice, setChoice] = useState("heads");
  const [result, setResult] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const { balance, placeBet, updateBetOutcome, setShowDepositModal } = useWallet();

  const potentialWin = (bet * MULTIPLIER).toFixed(2);

  const startGame = useCallback(() => {
    if (bet <= 0 || isFlipping) return;
    if (balance < bet) {
      setShowDepositModal(true);
      return;
    }

    const betId = placeBet(bet, "Casino", "Coin Toss");
    if (!betId) return;
    
    setIsFlipping(true);
    setStatus("playing");
    setResult(null);
    setWinAmount(0);

    setTimeout(() => {
      const isHeads = Math.random() > 0.5;
      const flipResult = isHeads ? "heads" : "tails";
      setResult(flipResult);
      
      if (flipResult === choice) {
        const win = +(bet * MULTIPLIER).toFixed(2);
        setStatus("won");
        setWinAmount(win);
        updateBetOutcome(betId, win, MULTIPLIER, "won");
      } else {
        setStatus("lost");
        updateBetOutcome(betId, 0, 0, "lost");
      }
      setIsFlipping(false);
    }, 1500);
  }, [bet, choice, isFlipping, balance, placeBet, updateBetOutcome]);

  const resetGame = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setWinAmount(0);
    setIsFlipping(false);
  }, []);

  const halfBet = () => setBet(prev => Math.max(1, Math.floor(prev / 2)));
  const doubleBet = () => setBet(prev => prev * 2);

  return (
    <div className="ct-root">
      <div className="ct-game">
        <aside className="ct-sidebar">
          <div className="ct-logo">
            <img src="/assets/GoldenCoin.svg" alt="Coin Toss Logo" className="ct-brand-icon" style={{ width: '32px', height: '32px' }} />
            <h2>Coin Toss</h2>
          </div>

          <div className="ct-field">
            <label>Bet Amount</label>
            <div className="ct-input-wrap">
              <span className="currency">$</span>
              <input
                type="number"
                min="1"
                value={bet}
                onChange={e => setBet(Math.max(0, Number(e.target.value)))}
                disabled={isFlipping}
              />
            </div>
            <div className="ct-quick-btns">
              <button onClick={halfBet} disabled={isFlipping}>½</button>
              <button onClick={doubleBet} disabled={isFlipping}>2×</button>
              <button onClick={() => setBet(100)} disabled={isFlipping}>100</button>
              <button onClick={() => setBet(500)} disabled={isFlipping}>500</button>
            </div>
          </div>

          <div className="ct-field ct-choice-field">
            <label>Choice</label>
            <div className="ct-choice-btns">
              <button 
                className={choice === "heads" ? "selected" : ""} 
                onClick={() => setChoice("heads")}
                disabled={isFlipping}
              >
                Heads
              </button>
              <button 
                className={choice === "tails" ? "selected" : ""} 
                onClick={() => setChoice("tails")}
                disabled={isFlipping}
              >
                Tails
              </button>
            </div>
          </div>

          <div className="ct-stats">
            <div className="ct-stat-row">
              <span className="label">Multiplier</span>
              <span className="value amber">{MULTIPLIER}×</span>
            </div>
            <div className="ct-stat-row">
              <span className="label">Potential Win</span>
              <span className="value green">${status === "idle" ? potentialWin : winAmount.toFixed(2)}</span>
            </div>
          </div>

          {!isFlipping && status !== "won" && status !== "lost" ? (
            <button className="ct-btn-primary bet ct-glowy-button" onClick={startGame} disabled={bet <= 0}>
              <span className="btn-text">PLAY</span>
              <div className="btn-glow-effect"></div>
            </button>
          ) : isFlipping ? (
            <button className="ct-btn-primary disabled" disabled>
              FLIPPING...
            </button>
          ) : (
            <button className="ct-btn-primary bet ct-glowy-button" onClick={resetGame}>
              <span className="btn-text">PLAY AGAIN</span>
              <div className="btn-glow-effect"></div>
            </button>
          )}
        </aside>

        <section className="ct-board-area">
          {status === "won" && (
            <div className="ct-result-overlay">
              <div className="ct-result-banner win">
                You Won!
                <span className="amount">${winAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
          {status === "lost" && (
            <div className="ct-result-overlay">
              <div className="ct-result-banner loss">
                You Lost!
                <span className="amount">$0.00</span>
              </div>
            </div>
          )}

          <div className="ct-coin-container">
            <div className={`ct-coin ${isFlipping ? "flipping" : ""} ${result ? `result-${result}` : ""}`}>
              <div className="ct-coin-face ct-coin-heads">HEADS</div>
              <div className="ct-coin-face ct-coin-tails">TAILS</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
