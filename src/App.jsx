import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
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


import DragonTower from "./Components/Dragon-Tower/DragonTower.jsx";
import WhackAMole from "./Components/Whack-A-Mole/WhackAMole.jsx";
import CoinToss from "./Components/Coin-Toss/CoinToss.jsx";
import Mines from "./Components/Mines/Mines.jsx";
import RPS from "./Components/RPS/RPS.jsx";
import GamesPage from "./Components/GamesPage/GamesPage.jsx";
import SportsPage from "./Components/SportsPage/SportsPage.jsx";

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
          
          {}
          <Route path="/casino" element={<GamesPage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/games/mines" element={<Mines />} />
          <Route path="/games/dragon-tower" element={<DragonTower />} />
          <Route path="/games/coin-toss" element={<CoinToss />} />
          <Route path="/games/whack-a-mole" element={<WhackAMole />} />
          <Route path="/games/rps" element={<RPS />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
