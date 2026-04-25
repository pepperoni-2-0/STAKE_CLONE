import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCasinoOpen, setIsCasinoOpen] = useState(true);
  const [isSportsOpen, setIsSportsOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        
        {}
        <div className="sidebar-section">
          <button 
            className="dropdown-toggle" 
            onClick={() => setIsCasinoOpen(!isCasinoOpen)}
          >
            <div className="toggle-left">
              <span>Casino</span>
            </div>
            <span className={`chevron ${isCasinoOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          <div className={`dropdown-content ${isCasinoOpen ? 'open' : ''}`}>
            <Link to="/games/mines" className="sub-item">Mines</Link>
            <Link to="/games/dragon-tower" className="sub-item">Dragon Tower</Link>
            <Link to="/games/coin-toss" className="sub-item">Coin Toss</Link>
            <Link to="/games/whack-a-mole" className="sub-item">Whack-A-Mole</Link>
            <Link to="/games/rps" className="sub-item">RPS Duel</Link>
          </div>
        </div>

        {}
        <div className="sidebar-section">
          <button 
            className="dropdown-toggle" 
            onClick={() => setIsSportsOpen(!isSportsOpen)}
          >
            <div className="toggle-left">
              <span>Sports</span>
            </div>
            <span className={`chevron ${isSportsOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          <div className={`dropdown-content ${isSportsOpen ? 'open' : ''}`}>
            <Link to="/cricket" className="sub-item">
              🏏 Cricket
            </Link>
            <Link to="/football" className="sub-item">
              ⚽ Football
            </Link>
            <Link to="/tennis" className="sub-item">
              🎾 Tennis
            </Link>
            <Link to="/basketball" className="sub-item">
              🏀 Basketball
            </Link>
          </div>
        </div>

        {}
        <Link to="/" className="static-link">
          Home
        </Link>
        
      </div>
    </aside>
  );
};

export default Sidebar;
