import { useNavigate } from 'react-router-dom';
import './TrendingGames.css';

const games = [
  { id: 1, name: 'Mines', players: '1,141', slug: 'mines', img: '/assets/mines_logo.png' },
  { id: 2, name: 'Dragon Tower', players: '2,302', slug: 'dragon-tower', img: 'https://mediumrare.imgix.net/2c3e16f0a3b8cd8d979265e48dd6a169937a4a4d0acb05ad532ca8345a1e6f21?w=180&amp;h=236&amp;fit=min&amp;auto=format' },
  { id: 3, name: 'Coin Toss', players: '890', slug: 'coin-toss', img: '/assets/coinToss.png' },
  { id: 4, name: 'Whack-A-Mole', players: '1,560', slug: 'whack-a-mole', img: 'https://mediumrare.imgix.net/5e6f7bb02df67a02a9182aab05d0976a9abbac7f45997975eed765332a8b7d73?w=180&amp;h=236&amp;fit=min&amp;auto=format' },
  { id: 5, name: 'RPS Duel', players: '3,412', slug: 'rps', img: '/assets/rps.png' },
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
            <div className="game-img" style={{ backgroundImage: `url(${game.img})` }}></div>
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
