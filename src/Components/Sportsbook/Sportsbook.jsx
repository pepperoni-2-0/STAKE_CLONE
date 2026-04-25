import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './Sportsbook.css'
import { useWallet } from '../../context/WalletContext'

import SportsBar from './SportsBar'
import LeagueSection from './LeagueSection'
import BetSlip from './BetSlip'
import SkeletonLoader from './SkeletonLoader'
import { fetchOddsForCategory, groupByLeague, hasApiKey, getRemainingQuota } from '../../services/oddsService'
import { preloadLogos } from '../../services/logoService'
import { useBetSlip } from '../../context/BetSlipContext'

export default function Sportsbook({ initialSport = 'football' }) {
  const navigate = useNavigate()
  const [activeSport, setActiveSport] = useState(initialSport)
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [matchCounts, setMatchCounts] = useState({})
  const [prevOddsMap, setPrevOddsMap] = useState({})
  const [quotaRemaining, setQuotaRemaining] = useState(null)

  const { selectedBets, toggleBet, removeBet, clearAllBets } = useBetSlip()

  const { balance, placeBet, updateBetOutcome, setShowDepositModal } = useWallet()


  const loadOdds = useCallback(async (sport, isRefresh = false) => {
    if (!hasApiKey()) {
      setError('API_KEY_MISSING')
      setLoading(false)
      return
    }

    if (!isRefresh) setLoading(true)
    setError(null)

    try {
      const events = await fetchOddsForCategory(sport)


      setPrevOddsMap((prev) => {
        const newMap = {}
        events.forEach((e) => {
          newMap[e.id] = prev[e.id] || e.odds
        })
        return newMap
      })

      const grouped = groupByLeague(events)
      setLeagues(grouped)


      setMatchCounts((prev) => ({ ...prev, [sport]: events.length }))


      const q = getRemainingQuota()
      if (q !== null) setQuotaRemaining(q)


      const teamNames = events.flatMap((e) => [e.homeTeam, e.awayTeam])
      preloadLogos([...new Set(teamNames)])
    } catch (err) {
      if (err.message === 'API_KEY_MISSING') {
        setError('API_KEY_MISSING')
      } else if (err.message === 'INVALID_API_KEY') {
        setError('INVALID_API_KEY')
      } else if (err.message === 'QUOTA_REACHED') {
        setError('QUOTA_REACHED')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])


  useEffect(() => {
    loadOdds(activeSport)
  }, [activeSport, loadOdds])

  const handleSportChange = (sport) => {
    if (sport !== activeSport) {
      navigate(`/${sport}`)
      setActiveSport(sport)
      setLeagues([])
    }
  }

  const handleToggleBet = (bet) => toggleBet(bet)
  const handleRemoveBet = (betId) => removeBet(betId)
  const handleClearAll = () => clearAllBets()

  const handlePlaceBet = (stake) => {
    const betList = Object.values(selectedBets);
    if (betList.length === 0 || stake <= 0) return;
    
    if (balance < stake) {
      setShowDepositModal(true);
      return;
    }

    const totalOdds = betList.reduce((acc, b) => acc * b.odds, 1);
    const gameName = betList.length === 1 ? betList[0].match : `${betList.length} Fold Parlay`;
    
    const betId = placeBet(stake, "Sports", gameName);
    if (betId) {

      setTimeout(() => {
        const won = Math.random() > 0.4; 
        if (won) {
          const payout = +(stake * totalOdds).toFixed(2);
          updateBetOutcome(betId, payout, totalOdds, "won");
        } else {
          updateBetOutcome(betId, 0, 0, "lost");
        }
      }, 10000);
      
      handleClearAll();
    }
  };


  const selectedBetsLookup = {}
  Object.keys(selectedBets).forEach((id) => {
    selectedBetsLookup[id] = true
  })

  return (
    <div className="sportsbook" id="sportsbook">
      <div className="sb-container">
        <div className="sb-main">
          {quotaRemaining !== null && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              color: quotaRemaining < 50 ? '#ff4d4f' : '#00e701',
              fontWeight: '600',
              marginBottom: '16px',
              letterSpacing: '0.5px'
            }}>
              <span style={{ marginRight: '6px' }}>🔋</span>
              API Quota: {quotaRemaining} / 500
            </div>
          )}
          <SportsBar
            activeSport={activeSport}
            onSportChange={handleSportChange}
            matchCounts={matchCounts}
          />


          {error === 'API_KEY_MISSING' && (
            <div className="sb-api-banner">
              <h3>🔑 API Key Required</h3>
              <p>
                Create a <code>.env</code> file in the project root with your Odds API key:
              </p>
              <p style={{ marginTop: 8 }}>
                <code>VITE_ODDS_API_KEY=your_api_key_here</code>
              </p>
              <p style={{ marginTop: 12 }}>
                Get a free key at{' '}
                <a href="https://the-odds-api.com/" target="_blank" rel="noopener noreferrer">
                  the-odds-api.com
                </a>
              </p>
            </div>
          )}

          {error === 'INVALID_API_KEY' && (
            <div className="sb-api-banner">
              <h3>⚠️ Invalid API Key</h3>
              <p>Your Odds API key is invalid or missing. Please check your <code>.env</code> file.</p>
            </div>
          )}

          {error === 'QUOTA_REACHED' && (
            <div className="sb-api-banner">
              <h3>🛑 Free Quota Exceeded</h3>
              <p>You have used up all 500 free requests for your Odds API key.</p>
              <p style={{ marginTop: 8 }}>
                During development, every time you saved a file, the app "hot-reloaded" and fetched odds from the API again. This burned through your free quota extremely fast.
              </p>
              <p style={{ marginTop: 12 }}>
                <strong>Good News:</strong> The app now uses a 10-minute Local Cache! Please generate one final free API key at <a href="https://the-odds-api.com/" target="_blank" rel="noopener noreferrer">the-odds-api.com</a> and it will last you practically forever while coding!
              </p>
            </div>
          )}


          {loading && <SkeletonLoader />}


          {!loading && !error && (
            <AnimatePresence mode="wait">
              {leagues.length > 0 ? (
                leagues.map((league) => (
                  <LeagueSection
                    key={league.sportKey}
                    league={league}
                    selectedBets={selectedBetsLookup}
                    onToggleBet={handleToggleBet}
                    prevOddsMap={prevOddsMap}
                  />
                ))
              ) : (
                <div className="sb-api-banner">
                  <h3>📭 No Matches Available</h3>
                  <p>No upcoming matches found for this sport. Check back later!</p>
                </div>
              )}
            </AnimatePresence>
          )}


          {!loading && error && error !== 'API_KEY_MISSING' && error !== 'INVALID_API_KEY' && (
            <div className="sb-api-banner">
              <h3>⚠️ Error Loading Data</h3>
              <p>{error}</p>
            </div>
          )}
        </div>


        <BetSlip
          bets={selectedBets}
          onRemoveBet={handleRemoveBet}
          onClearAll={handleClearAll}
          onPlaceBet={handlePlaceBet}
        />
      </div>
    </div>
  )
}
