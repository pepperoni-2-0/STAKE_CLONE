import { useNavigate } from 'react-router-dom';
import './TrendingSports.css';

const sports = [
  { id: 'cricket', name: 'Cricket', path: '/cricket', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=520&fit=crop&auto=format' },
  { id: 'football', name: 'Soccer', path: '/football', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=520&fit=crop&auto=format' },
  { id: 'tennis', name: 'Tennis', path: '/tennis', img: 'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=400&h=520&fit=crop&auto=format' },
  { id: 'basketball', name: 'Basketball', path: '/basketball', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=520&fit=crop&auto=format' },
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSports;
