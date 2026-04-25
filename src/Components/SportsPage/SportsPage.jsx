import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// We reuse the exact same CSS classes from GamesPage to keep 100% UI consistency!
import "../GamesPage/GamesPage.css";
import BetHistory from "../BetHistory/BetHistory";

const SPORTS = [
  { id: "cricket", slug: "cricket", name: "Cricket", img: "https://mediumrare.imgix.net/cricket-en.png?w=180&auto=format", color: "#00bfff", bgGradient: "linear-gradient(135deg, #001f2a 0%, #00131a 100%)" },
  { id: "football", slug: "football", name: "Football", img: "https://mediumrare.imgix.net/soccer-en.png?w=180&auto=format", color: "#ff4d4d", bgGradient: "linear-gradient(135deg, #2a0808 0%, #1a0505 100%)" },
  { id: "tennis", slug: "tennis", name: "Tennis", img: "https://mediumrare.imgix.net/tennis-en.png?w=180&auto=format", color: "#00e676", bgGradient: "linear-gradient(135deg, #002a15 0%, #001a0d 100%)" },
  { id: "basketball", slug: "basketball", name: "Basketball", img: "https://mediumrare.imgix.net/basketball-en.png?w=180&auto=format", color: "#ffb700", bgGradient: "linear-gradient(135deg, #2a1f00 0%, #1a1300 100%)" }
];

export default function SportsPage() {
  const navigate = useNavigate();
  return (
    <div className="gp-root">
      
      <div className="gp-bg-glow gp-glow-1"></div>
      <div className="gp-bg-glow gp-glow-2"></div>
      <div className="gp-particles"></div>

      <div className="gp-content">
        <header className="gp-header">
          <div className="gp-header-badge">NEXUS SPORTSBOOK</div>
          <h1 className="gp-title">Sports Betting</h1>
          <p className="gp-subtitle">Experience our live odds, top matches, and real-time betting.</p>
        </header>

        <div className="gp-grid">
          {SPORTS.map((sport, index) => (
            <SportCard key={sport.id} sport={sport} index={index} onClick={() => navigate(`/${sport.slug}`)} />
          ))}
        </div>

        <BetHistory />
      </div>
    </div>
  );
}

function SportCard({ sport, index, onClick }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  return (
    <div 
      className="gp-card-wrapper"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div 
        ref={cardRef}
        className="gp-card"
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          transform: transform || "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
          "--theme-color": sport.color,
          background: sport.bgGradient
        }}
      >
        <div className="gp-card-glow-border"></div>
        <div className="gp-card-content">
          <div className="gp-icon-wrapper" style={{ backgroundImage: `url(${sport.img})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: '200px', borderRadius: '12px', marginBottom: '16px' }}>
          </div>
          <h3 className="gp-card-title">{sport.name}</h3>
          
          <div className="gp-play-btn-wrapper">
            <button className="gp-play-btn">
              BET NOW
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
