import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-grid">
          
          <div className="hero-card casino-card" onClick={() => navigate('/casino')} style={{ cursor: 'pointer' }}>
            <div className="card-bg"></div>
            <div className="card-content">
              <div className="badge">
                <span className="dot"></span> 31,794
              </div>
              <h2>Casino</h2>
            </div>
          </div>

          <div className="hero-card sports-card" onClick={() => navigate('/sports')} style={{ cursor: 'pointer' }}>
            <div className="card-bg"></div>
            <div className="card-content">
              <div className="badge">
                <span className="dot"></span> 62,490
              </div>
              <h2>Sports</h2>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
