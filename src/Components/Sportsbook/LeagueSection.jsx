import React from 'react'
import { motion } from 'framer-motion'
import MatchRow from './MatchRow'

export default function LeagueSection({ league, selectedBets, onToggleBet, prevOddsMap }) {
  const { leagueInfo, events } = league

  return (
    <motion.div
      className="league-section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="league-header">
        <div className="league-info">
          <span className="league-country">{leagueInfo.country}</span>
          <span className="league-divider">/</span>
          <span className="league-name">{leagueInfo.league}</span>
        </div>
        <span className="league-count">{events.length} match{events.length !== 1 ? 'es' : ''}</span>
      </div>

      {events.map((event, idx) => (
        <MatchRow
          key={event.id}
          event={event}
          index={idx}
          selectedBets={selectedBets}
          onToggleBet={onToggleBet}
          prevOdds={prevOddsMap?.[event.id]}
        />
      ))}
    </motion.div>
  )
}
