import React from 'react'
import { motion } from 'framer-motion'
import { SPORTS_CONFIG } from '../../services/oddsService'

const SPORT_KEYS = ['football', 'cricket', 'tennis', 'basketball']

export default function SportsBar({ activeSport, onSportChange, matchCounts }) {
  return (
    <nav className="sports-bar" id="sports-bar">
      {SPORT_KEYS.map((key) => {
        const sport = SPORTS_CONFIG[key]
        const count = matchCounts[key] ?? 0
        const isActive = activeSport === key

        return (
          <motion.button
            key={key}
            className={`sport-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSportChange(key)}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <span className="sport-tab-icon">{sport.icon}</span>
            <span>{sport.label}</span>
            {count > 0 && (
              <motion.span
                className="sport-tab-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={count}
              >
                {count}
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}
