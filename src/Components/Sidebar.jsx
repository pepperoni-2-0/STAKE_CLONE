import { useState } from 'react';
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
            <a href="#sweet-bonanza" className="sub-item active">
              Sweet Bonanza 2500
            </a>
            <a href="#gates-of-olympus" className="sub-item">
              Gates of Olympus 1000
            </a>
            <a href="#wanted-dead" className="sub-item">
              Wanted Dead or a Wild
            </a>
            <a href="#sugar-rush" className="sub-item">
              Sugar Rush
            </a>
            <a href="#starlight-princess" className="sub-item">
              Starlight Princess
            </a>
            <a href="#fruit-party" className="sub-item">
              Fruit Party
            </a>
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
            <a href="#cricket" className="sub-item">
              Cricket
            </a>
            <a href="#football" className="sub-item">
              Football
            </a>
            <a href="#tennis" className="sub-item">
              Tennis
            </a>
            <a href="#basketball" className="sub-item">
              Basketball
            </a>
          </div>
        </div>

        {/* Static Links */}
        <a href="#about" className="static-link">
          About
        </a>
        
      </div>
    </aside>
  );
};

export default Sidebar;
