import { useNavigate } from 'react-router-dom';
import './TrendingSports.css';

const sports = [
  { id: 'cricket', name: 'Cricket', path: '/cricket', img: 'https://api.the-odds-api.com/v4/sports: 'Bet Now →' },
  { id: 'football', name: 'Football', path: '/football', img: 'https://api.the-odds-api.com/v4/sports: 'View Matches →' },
  { id: 'tennis', name: 'Tennis', path: '/tennis', img: 'https://api.the-odds-api.com/v4/sports: 'Bet Now →' },
  { id: 'basketball', name: 'Basketball', path: '/basketball', img: 'https://api.the-odds-api.com/v4/sports: 'View Matches →' },
];

const TrendingSports = () => {
  const navigate = useNavigate();

  return (
    <section className="sports-section">
      <div className="section-header">
        <div className="title-group">
          <h2>Trending Sports</h2>
        </div>
      </div>
      
      <div className="sports-grid">
        {sports.map(sport => (
          <div 
            key={sport.id} 
            className="sport-card-large"
            onClick={() => navigate(sport.path)}
          >
            <div className="sport-img" style={{ backgroundImage: `url(${sport.img})` }}></div>
            <div className="sport-info">
              <span className="cta-text">{sport.cta}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSports;
