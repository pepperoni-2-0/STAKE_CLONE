import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import OddsButton from './OddsButton'
import { fetchTeamLogo, getCachedLogo, generateFallbackAvatar } from '../../services/logoService'

function formatMatchTime(commenceTime) {
  const date = new Date(commenceTime)
  const now = new Date()
  const diffMs = date - now

  if (diffMs < 0) {

    return { isLive: true, time: 'LIVE', date: '' }
  }

  const diffHours = diffMs / (1000 * 60 * 60)
  if (diffHours < 24) {
    return {
      isLive: false,
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
    }
  }

  return {
    isLive: false,
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
  }
}

export default function MatchRow({ event, selectedBets, onToggleBet, prevOdds, index }) {
  const [homeLogo, setHomeLogo] = useState(() => getCachedLogo(event.homeTeam))
  const [awayLogo, setAwayLogo] = useState(() => getCachedLogo(event.awayTeam))

  useEffect(() => {
    fetchTeamLogo(event.homeTeam).then(setHomeLogo)
    fetchTeamLogo(event.awayTeam).then(setAwayLogo)
  }, [event.homeTeam, event.awayTeam])

  const { isLive, time, date } = formatMatchTime(event.commenceTime)
  const odds = event.odds || {}
  const prev = prevOdds || {}

  const homeOdds = odds[event.homeTeam]
  const awayOdds = odds[event.awayTeam]
  const drawOdds = odds['Draw']

  const betId = (type) => `${event.id}_${type}`

  const handleBet = (type, teamLabel, oddsVal) => {
    onToggleBet({
      id: betId(type),
      eventId: event.id,
      match: `${event.homeTeam} vs ${event.awayTeam}`,
      selection: teamLabel,
      odds: oddsVal,
    })
  }

  return (
    <motion.div
      className="match-row"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      layout
    >

      <div className="match-teams">
        <div className="match-team">
          <img
            className="team-logo"
            src={homeLogo}
            alt={event.homeTeam}
            onError={(e) => { e.target.src = generateFallbackAvatar(event.homeTeam) }}
          />
          <span className="team-name">{event.homeTeam}</span>
        </div>
        <div className="match-team">
          <img
            className="team-logo"
            src={awayLogo}
            alt={event.awayTeam}
            onError={(e) => { e.target.src = generateFallbackAvatar(event.awayTeam) }}
          />
          <span className="team-name">{event.awayTeam}</span>
        </div>
      </div>


      <div className="match-status">
        {isLive ? (
          <span className="live-badge">
            <span className="live-dot" />
            Live
          </span>
        ) : (
          <>
            <span className="match-time">{time}</span>
            {date && <span className="match-date">{date}</span>}
          </>
        )}
      </div>


      <div className="odds-group">
        <OddsButton
          label="1"
          value={homeOdds}
          prevValue={prev[event.homeTeam]}
          selected={!!selectedBets[betId('home')]}
          onClick={() => handleBet('home', event.homeTeam, homeOdds)}
        />
        {drawOdds !== undefined && (
          <OddsButton
            label="X"
            value={drawOdds}
            prevValue={prev['Draw']}
            selected={!!selectedBets[betId('draw')]}
            onClick={() => handleBet('draw', 'Draw', drawOdds)}
          />
        )}
        <OddsButton
          label="2"
          value={awayOdds}
          prevValue={prev[event.awayTeam]}
          selected={!!selectedBets[betId('away')]}
          onClick={() => handleBet('away', event.awayTeam, awayOdds)}
        />
      </div>
    </motion.div>
  )
}
