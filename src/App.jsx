import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import CricketPage from './pages/CricketPage';
import FootballPage from './pages/FootballPage';
import TennisPage from './pages/TennisPage';
import BasketballPage from './pages/BasketballPage';

import SweetBonanzaPage from './pages/games/SweetBonanzaPage';
import GatesOfOlympusPage from './pages/games/GatesOfOlympusPage';
import WantedDeadPage from './pages/games/WantedDeadPage';
import SugarRushPage from './pages/games/SugarRushPage';
import StarlightPrincessPage from './pages/games/StarlightPrincessPage';
import FruitPartyPage from './pages/games/FruitPartyPage';

import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/cricket" element={<CricketPage />} />
          <Route path="/football" element={<FootballPage />} />
          <Route path="/tennis" element={<TennisPage />} />
          <Route path="/basketball" element={<BasketballPage />} />

          <Route path="/games/sweet-bonanza" element={<SweetBonanzaPage />} />
          <Route path="/games/gates-of-olympus" element={<GatesOfOlympusPage />} />
          <Route path="/games/wanted-dead" element={<WantedDeadPage />} />
          <Route path="/games/sugar-rush" element={<SugarRushPage />} />
          <Route path="/games/starlight-princess" element={<StarlightPrincessPage />} />
          <Route path="/games/fruit-party" element={<FruitPartyPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
