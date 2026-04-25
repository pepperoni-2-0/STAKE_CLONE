import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import { useWallet } from './context/WalletContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
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

import DragonTower from "./Components/Dragon-Tower/DragonTower.jsx";
import WhackAMole from "./Components/Whack-A-Mole/WhackAMole.jsx";
import CoinToss from "./Components/Coin-Toss/CoinToss.jsx";
import Mines from "./Components/Mines/Mines.jsx";
import RPS from "./Components/RPS/RPS.jsx";
import GamesPage from "./Components/GamesPage/GamesPage.jsx";
import SportsPage from "./Components/SportsPage/SportsPage.jsx";

import './App.css';

// Redirects to /login if no user is logged in
function RequireLogin({ children }) {
  const { user } = useWallet();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/cricket" element={<CricketPage />} />
          <Route path="/football" element={<FootballPage />} />
          <Route path="/tennis" element={<TennisPage />} />
          <Route path="/basketball" element={<BasketballPage />} />

          <Route path="/games/sweet-bonanza" element={<RequireLogin><SweetBonanzaPage /></RequireLogin>} />
          <Route path="/games/gates-of-olympus" element={<RequireLogin><GatesOfOlympusPage /></RequireLogin>} />
          <Route path="/games/wanted-dead" element={<RequireLogin><WantedDeadPage /></RequireLogin>} />
          <Route path="/games/sugar-rush" element={<RequireLogin><SugarRushPage /></RequireLogin>} />
          <Route path="/games/starlight-princess" element={<RequireLogin><StarlightPrincessPage /></RequireLogin>} />
          <Route path="/games/fruit-party" element={<RequireLogin><FruitPartyPage /></RequireLogin>} />
          
          <Route path="/casino" element={<GamesPage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/games/mines" element={<RequireLogin><Mines /></RequireLogin>} />
          <Route path="/games/dragon-tower" element={<RequireLogin><DragonTower /></RequireLogin>} />
          <Route path="/games/coin-toss" element={<RequireLogin><CoinToss /></RequireLogin>} />
          <Route path="/games/whack-a-mole" element={<RequireLogin><WhackAMole /></RequireLogin>} />
          <Route path="/games/rps" element={<RequireLogin><RPS /></RequireLogin>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
