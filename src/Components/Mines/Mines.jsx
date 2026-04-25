import { useState, useCallback, useMemo } from "react";
import "./Mines.css";
import { useWallet } from "../../context/WalletContext";

const TOTAL_TILES = 25;

// No more GemIcon, using 1.png

export default function Mines() {
  const [status, setStatus] = useState("idle");
  const [bet, setBet] = useState(100);
  const [minesCount, setMinesCount] = useState(5);
  const [winAmount, setWinAmount] = useState(0);
  
  const [minesPositions, setMolesPositions] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [hits, setHits] = useState(0);
  const [currentBetId, setCurrentBetId] = useState(null);

  const { balance, placeBet, updateBetOutcome, setShowDepositModal } = useWallet();

  const isPlaying = status === "playing";
  const isFinished = status === "won" || status === "lost" || status === "cashed";

  const currentMultiplier = useMemo(() => {
    if (hits === 0) return 1.0;
    let mult = 0.99;
    for (let i = 0; i < hits; i++) {
      mult *= (TOTAL_TILES - i) / (TOTAL_TILES - i - minesCount);
    }
    return mult;
  }, [hits, minesCount]);

  const nextMultiplier = useMemo(() => {
    let mult = 0.99;
    for (let i = 0; i <= hits; i++) {
      mult *= (TOTAL_TILES - i) / (TOTAL_TILES - i - minesCount);
    }
    return mult;
  }, [hits, minesCount]);

  const potentialWin = (bet * currentMultiplier).toFixed(2);

  const generateMines = useCallback((firstClickIndex) => {
    const positions = [];
    while (positions.length < minesCount) {
      const r = Math.floor(Math.random() * TOTAL_TILES);
      if (!positions.includes(r) && r !== firstClickIndex) {
        positions.push(r);
      }
    }
    setMolesPositions(positions);
    return positions;
  }, [minesCount]);

  const startGame = useCallback(() => {
    if (bet <= 0 || minesCount < 1 || minesCount >= TOTAL_TILES) return;
    if (balance < bet) {
      setShowDepositModal(true);
      return;
    }

    const betId = placeBet(bet, "Casino", "Mines");
    if (!betId) return;

    setCurrentBetId(betId);
    setMolesPositions([]);
    setRevealed({});
    setHits(0);
    setWinAmount(0);
    setStatus("playing");
  }, [bet, minesCount, balance, placeBet]);

  const handleTileClick = useCallback((index) => {
    if (!isPlaying || revealed[index]) return;

    let currentMines = minesPositions;
    if (hits === 0) {
      currentMines = generateMines(index);
    }

    const newRevealed = { ...revealed, [index]: true };
    setRevealed(newRevealed);

    if (currentMines.includes(index)) {
      setStatus("lost");
      setWinAmount(0);
      updateBetOutcome(currentBetId, 0, 0, "lost");
      
      const allRevealed = {};
      for (let i = 0; i < TOTAL_TILES; i++) allRevealed[i] = true;
      setRevealed(allRevealed);
    } else {
      const newHits = hits + 1;
      setHits(newHits);
      
      if (newHits === TOTAL_TILES - minesCount) {
        setStatus("won");
        let finalMult = 0.99;
        for (let i = 0; i < newHits; i++) {
          finalMult *= (TOTAL_TILES - i) / (TOTAL_TILES - i - minesCount);
        }
        const win = +(bet * finalMult).toFixed(2);
        setWinAmount(win);
        updateBetOutcome(currentBetId, win, finalMult, "won");
      }
    }
  }, [isPlaying, revealed, hits, minesPositions, generateMines, minesCount, bet, currentBetId, updateBetOutcome]);

  const cashOut = useCallback(() => {
    if (!isPlaying || hits === 0) return;
    const win = +(bet * currentMultiplier).toFixed(2);
    setStatus("cashed");
    setWinAmount(win);
    updateBetOutcome(currentBetId, win, currentMultiplier, "won");
    
    const allRevealed = {};
    for (let i = 0; i < TOTAL_TILES; i++) allRevealed[i] = true;
    setRevealed(allRevealed);
  }, [isPlaying, hits, bet, currentMultiplier, currentBetId, updateBetOutcome]);

  const resetGame = useCallback(() => {
    setMolesPositions([]);
    setRevealed({});
    setHits(0);
    setWinAmount(0);
    setStatus("idle");
  }, []);

  const halfBet = () => setBet(prev => Math.max(1, Math.floor(prev / 2)));
  const doubleBet = () => setBet(prev => prev * 2);

  return (
    <div className="mines-root">
      <div className="mines-game">
        <aside className="mines-sidebar">
          <div className="mines-logo">
            <img src="/assets/bomb.svg" alt="Mines Logo" className="mines-brand-icon" />
            <h2>Mines</h2>
          </div>

          <div className="mines-field">
            <label>Bet Amount</label>
            <div className="mines-input-wrap">
              <span className="currency">$</span>
              <input
                type="number"
                min="1"
                value={bet}
                onChange={e => setBet(Math.max(0, Number(e.target.value)))}
                disabled={isPlaying}
              />
            </div>
            <div className="mines-quick-btns">
              <button onClick={halfBet} disabled={isPlaying}>½</button>
              <button onClick={doubleBet} disabled={isPlaying}>2×</button>
              <button onClick={() => setBet(100)} disabled={isPlaying}>100</button>
              <button onClick={() => setBet(500)} disabled={isPlaying}>500</button>
            </div>
          </div>

          <div className="mines-field">
            <label>Mines</label>
            <div className="mines-input-wrap">
              <input
                type="number"
                min="1"
                max="24"
                value={minesCount}
                onChange={e => setMinesCount(Math.min(24, Math.max(1, Number(e.target.value))))}
                disabled={isPlaying}
              />
            </div>
          </div>

          <div className="mines-stats">
            <div className="mines-stat-row">
              <span className="label">Gems Found</span>
              <span className="value white">{hits}</span>
            </div>
            <div className="mines-stat-row">
              <span className="label">Next Multiplier</span>
              <span className="value amber">{nextMultiplier.toFixed(2)}×</span>
            </div>
            <div className="mines-stat-row">
              <span className="label">Potential Win</span>
              <span className="value green">${isPlaying || status === "idle" ? potentialWin : winAmount.toFixed(2)}</span>
            </div>
          </div>

          {!isPlaying ? (
            <button className="mines-btn-primary bet mines-glowy-button" onClick={startGame} disabled={bet <= 0}>
              <span className="btn-text">{isFinished ? "PLAY AGAIN" : "PLACE BET"}</span>
              <div className="btn-glow-effect"></div>
            </button>
          ) : (
            <button
              className={`mines-btn-primary cashout${hits > 0 ? " active-glow" : ""}`}
              onClick={cashOut}
              disabled={hits === 0}
            >
              CASH OUT — ${potentialWin}
            </button>
          )}

          {isFinished && (
            <button className="mines-btn-secondary" onClick={resetGame}>
              Reset
            </button>
          )}
        </aside>

        <section className="mines-board-area">
          {status === "lost" && (
            <div className="mines-result-overlay">
              <div className="mines-result-banner loss">
                Mine Hit!
                <span className="amount">$0.00</span>
              </div>
            </div>
          )}
          {status === "cashed" && (
            <div className="mines-result-overlay">
              <div className="mines-result-banner cashout-banner">
                Cashed Out!
                <span className="amount">${winAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
          {status === "won" && (
            <div className="mines-result-overlay">
              <div className="mines-result-banner win">
                All Gems Found!
                <span className="amount">${winAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="mines-grid">
            {Array.from({ length: TOTAL_TILES }).map((_, index) => {
              const isRevealed = revealed[index];
              const isMine = isRevealed && minesPositions.includes(index);
              const isGem = isRevealed && !minesPositions.includes(index);

              let tileClass = "mines-tile";
              if (isRevealed) {
                tileClass += isMine ? " revealed-mine" : " revealed-gem";
              }

              return (
                <button
                  key={index}
                  className={tileClass}
                  onClick={() => handleTileClick(index)}
                  disabled={!isPlaying || isRevealed}
                >
                  {isGem && <img src="/assets/bluediamond.svg" alt="Gem" className="mines-gem-img" />}
                  {isMine && <img src="/assets/bomb.svg" alt="Bomb" className="mines-bomb-img" />}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
