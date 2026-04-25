import { useNavigate } from 'react-router-dom';
import './TrendingGames.css';

const games = [
  { id: 1, name: 'Mines', players: '1,141', slug: 'mines', img: '/assets/mines_logo.png', bgSize: 'cover' },
  { id: 2, name: 'Dragon Tower', players: '2,302', slug: 'dragon-tower', img: '/assets/dragontower.png', bgSize: 'cover' },
  { id: 3, name: 'Coin Toss', players: '890', slug: 'coin-toss', img: '/assets/coinToss.png', bgSize: 'contain' },
  { id: 4, name: 'Whack-A-Mole', players: '1,560', slug: 'whack-a-mole', img: '/assets/whack.png', bgSize: 'cover' },
  { id: 5, name: 'RPS Duel', players: '3,412', slug: 'rps', img: '/assets/rps.png', bgSize: 'contain' },
];

const TrendingGames = () => {
  const navigate = useNavigate();

  return (
    <section className="trending-section">
      <div className="section-header">
        <div className="title-group">
          <h2>Trending Games</h2>
        </div>
      </div>
      
      <div className="scroll-container hide-scrollbar">
        {games.map(game => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={() => navigate(`/games/${game.slug}`)}
          >
            <div className="game-img" style={{ backgroundImage: `url(${game.img})`, backgroundSize: game.bgSize || 'contain' }}></div>
            <div className="game-info">
              <div className="player-count">
                <span className="dot"></span> {game.players} playing
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingGames;
