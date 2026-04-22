import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCasinoOpen, setIsCasinoOpen] = useState(true);
  const [isSportsOpen, setIsSportsOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        
        {/* Casino Dropdown */}
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
            <Link to="/games/sweet-bonanza" className="sub-item active">
              Sweet Bonanza 2500
            </Link>
            <Link to="/games/gates-of-olympus" className="sub-item">
              Gates of Olympus 1000
            </Link>
            <Link to="/games/wanted-dead" className="sub-item">
              Wanted Dead or a Wild
            </Link>
            <Link to="/games/sugar-rush" className="sub-item">
              Sugar Rush
            </Link>
            <Link to="/games/starlight-princess" className="sub-item">
              Starlight Princess
            </Link>
            <Link to="/games/fruit-party" className="sub-item">
              Fruit Party
            </Link>
          </div>
        </div>

        {/* Sports Dropdown */}
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

        {/* Static Links */}
        <Link to="/" className="static-link">
          Home
        </Link>
        
      </div>
    </aside>
  );
};

export default Sidebar;
