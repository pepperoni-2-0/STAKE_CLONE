import { useState, useCallback, useMemo } from "react";
import "./DragonTower.css";

const ROWS = 9;
const COLS = 3;

const MULTIPLIERS = [1, 1.45, 2.1, 3.05, 4.42, 6.41, 9.3, 13.48, 19.55, 28.35];

const REWARD_IMAGES = [
  9, 10, ...Array.from({ length: 28 }, (_, i) => i + 23)
].map(n => `/assets/dragon-rewards/${n}.png`);

const AncientEggIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="url(#goldAncientGrad)" className={className} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.7))">
    <defs>
      <linearGradient id="goldAncientGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#cca141" />
        <stop offset="40%" stopColor="#8d681b" />
        <stop offset="100%" stopColor="#4a370b" />
      </linearGradient>
      <pattern id="scales" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M0 4 Q 2 0 4 4" stroke="rgba(255,200,50,0.15)" strokeWidth="0.5" fill="none"/>
        <path d="M0 4 Q 2 2 4 4" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" fill="none"/>
      </pattern>
    </defs>
    
    <path d="M12 2C6 2 3 10 3 15.5C3 20.1944 7.02944 24 12 24C16.9706 24 21 20.1944 21 15.5C21 10 18 2 12 2Z" />
    <path d="M12 2C6 2 3 10 3 15.5C3 20.1944 7.02944 24 12 24C16.9706 24 21 20.1944 21 15.5C21 10 18 2 12 2Z" fill="url(#scales)"/>
    <path d="M12 2 Q10 8 13.5 10 T12 22 M5 12 Q8 14 6 19 M19 13 Q16 14 18 20 M14 5 Q17 8 16 11" stroke="rgba(0,0,0,0.5)" strokeWidth="0.8" fill="none" opacity="0.8"/>
    <path d="M12 3C8 3 5 9 4.5 14" stroke="#eecd86" strokeWidth="0.7" fill="none" opacity="0.5"/>
  </svg>
);

const DRAGON_IMG = "/assets/1.png";

const sfx = {
  click:   () => { },
  correct: () => { },
  dead:    () => { },
  cashout: () => { },
  start:   () => { },
};

function buildTower(rows, cols) {
  const tower = [];
  for (let i = 0; i < rows; i++) {
    const deadIndex = Math.floor(Math.random() * cols);
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        isDead: j === deadIndex,
        rewardImg: REWARD_IMAGES[Math.floor(Math.random() * REWARD_IMAGES.length)]
      });
    }
    tower.push(row);
  }
  return tower;
}

export default function DragonTower() {
  const [tower, setTower]   = useState([]);
  const [status, setStatus] = useState("idle");
  const [revealed, setRevealed]       = useState({});
  const [currentLevel, setCurrentLevel] = useState(0);
  const [bet, setBet] = useState(100);
  const [winAmount, setWinAmount] = useState(0);

  const multiplier  = MULTIPLIERS[Math.min(currentLevel, MULTIPLIERS.length - 1)];
  const potentialWin = (bet * multiplier).toFixed(2);
  const isPlaying    = status === "playing";
  const isFinished   = status === "won" || status === "lost" || status === "cashed";

  const startGame = useCallback(() => {
    if (bet <= 0) return;
    sfx.start();
    setTower(buildTower(ROWS, COLS));
    setRevealed({});
    setCurrentLevel(0);
    setWinAmount(0);
    setStatus("playing");
  }, [bet]);

  const handleTile = useCallback((row, col) => {
    if (!isPlaying || row !== currentLevel) return;

    const key = `${row}-${col}`;
    if (revealed[key]) return;

    sfx.click();
    setRevealed(prev => ({ ...prev, [key]: true }));

    const isDead = tower[row][col].isDead;

    if (isDead) {
      sfx.dead();
      const fullRow = {};
      for (let c = 0; c < COLS; c++) fullRow[`${row}-${c}`] = true;
      setRevealed(prev => ({ ...prev, ...fullRow }));
      setStatus("lost");
      setWinAmount(0);
    } else {
      sfx.correct();
      const nextLevel = row + 1;
      const won = nextLevel >= ROWS;
      if (won) {
        const final = +(bet * MULTIPLIERS[ROWS]).toFixed(2);
        setWinAmount(final);
        setCurrentLevel(ROWS);
        setStatus("won");
      } else {
        setCurrentLevel(nextLevel);
        setWinAmount(+(bet * MULTIPLIERS[nextLevel]).toFixed(2));
      }
    }
  }, [isPlaying, currentLevel, revealed, tower, bet]);

  const cashOut = useCallback(() => {
    if (!isPlaying || currentLevel === 0) return;
    sfx.cashout();
    const final = +(bet * MULTIPLIERS[currentLevel]).toFixed(2);
    setWinAmount(final);
    setStatus("cashed");
  }, [isPlaying, currentLevel, bet]);

  const resetGame = useCallback(() => {
    setTower([]);
    setRevealed({});
    setCurrentLevel(0);
    setWinAmount(0);
    setStatus("idle");
  }, []);

  const halfBet   = () => setBet(prev => Math.max(1, Math.floor(prev / 2)));
  const doubleBet = () => setBet(prev => prev * 2);

  function tileClass(rowIdx, colIdx) {
    const key = `${rowIdx}-${colIdx}`;
    const isRevealed = revealed[key];
    const isDead = tower[rowIdx]?.[colIdx]?.isDead;

    if (isRevealed && isDead) return "dt-tile revealed-dead";
    if (isRevealed && !isDead) return "dt-tile revealed-safe";

    if (status === "lost" && rowIdx === currentLevel) return "dt-tile reveal-after-loss";

    if (isPlaying && rowIdx === currentLevel) return "dt-tile clickable";
    return "dt-tile idle";
  }

  function tileIcon(rowIdx, colIdx) {
    const key = `${rowIdx}-${colIdx}`;
    const isRevealed = revealed[key];
    const cell = tower[rowIdx]?.[colIdx];
    
    if (isRevealed) {
      if (cell?.isDead) return <img src={DRAGON_IMG} alt="Dragon" className="dt-dragon-img" loading="lazy" />;
      return <img src={cell?.rewardImg} alt="Reward" className="dt-reward-img" loading="lazy" />;
    }
    return <AncientEggIcon className="dt-icon-svg" />;
  }

  function rowClass(rowIdx) {
    if (isPlaying && rowIdx === currentLevel) return "dt-row active";
    if (rowIdx < currentLevel) return "dt-row cleared";
    if (status === "lost" && rowIdx === currentLevel) return "dt-row lost";
    return "dt-row";
  }

  return (
    <div className="dt-root">
      <div className="dt-game">

        <aside className="dt-sidebar">
          <div className="dt-logo">
            <AncientEggIcon className="dt-brand-icon" />
            <h2>Dragon Tower</h2>
          </div>

          <div className="dt-field">
            <label>Bet Amount</label>
            <div className="dt-input-wrap">
              <span className="currency">$</span>
              <input
                type="number"
                min="1"
                value={bet}
                onChange={e => setBet(Math.max(0, Number(e.target.value)))}
                disabled={isPlaying}
              />
            </div>
            <div className="dt-quick-btns">
              <button onClick={halfBet} disabled={isPlaying}>½</button>
              <button onClick={doubleBet} disabled={isPlaying}>2×</button>
              <button onClick={() => setBet(100)} disabled={isPlaying}>100</button>
              <button onClick={() => setBet(500)} disabled={isPlaying}>500</button>
            </div>
          </div>

          <div className="dt-stats">
            <div className="dt-stat-row">
              <span className="label">Level</span>
              <span className="value white">{currentLevel} / {ROWS}</span>
            </div>
            <div className="dt-stat-row">
              <span className="label">Multiplier</span>
              <span className="value amber">{multiplier.toFixed(2)}×</span>
            </div>
            <div className="dt-stat-row">
              <span className="label">Potential Win</span>
              <span className="value green">${isPlaying || status === "idle" ? potentialWin : winAmount.toFixed(2)}</span>
            </div>
          </div>

          {!isPlaying ? (
            <button className="dt-btn-primary bet dt-glowy-button" onClick={startGame} disabled={bet <= 0}>
              <span className="btn-text">{isFinished ? "PLAY AGAIN" : "PLACE BET"}</span>
              <div className="btn-glow-effect"></div>
            </button>
          ) : (
            <button
              className={`dt-btn-primary cashout${currentLevel > 0 ? " active-glow" : ""}`}
              onClick={cashOut}
              disabled={currentLevel === 0}
            >
              CASH OUT — ${potentialWin}
            </button>
          )}

          {isFinished && (
            <button className="dt-btn-secondary" onClick={resetGame}>
              Reset
            </button>
          )}
        </aside>

        <section className="dt-tower-area">

          {status === "won" && (
            <div className="dt-result-overlay">
              <div className="dt-result-banner win">
                You won!
                <span className="amount">${winAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
          {status === "lost" && (
            <div className="dt-result-overlay">
              <div className="dt-result-banner loss">
                Dragon got you!
                <span className="amount">$0.00</span>
              </div>
            </div>
          )}
          {status === "cashed" && (
            <div className="dt-result-overlay">
              <div className="dt-result-banner cashout-banner">
                Cashed Out!
                <span className="amount">${winAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {tower.length > 0 ? (
            <div className="dt-tower-grid">
              {tower.map((rowData, rowIdx) => (
                <div
                  key={rowIdx}
                  className={rowClass(rowIdx)}
                  style={{ animationDelay: `${rowIdx * 40}ms` }}
                >
                  <span className="dt-row-multiplier">
                    {MULTIPLIERS[rowIdx + 1]?.toFixed(2)}×
                  </span>
                  {Array.from({ length: COLS }).map((_, colIdx) => (
                    <button
                      key={colIdx}
                      className={tileClass(rowIdx, colIdx)}
                      onClick={() => handleTile(rowIdx, colIdx)}
                      disabled={!(isPlaying && rowIdx === currentLevel)}
                    >
                      {tileIcon(rowIdx, colIdx)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="dt-idle-state">
              <AncientEggIcon className="dt-idle-icon" />
              <p>Place a bet to begin climbing</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
