import React, { useState, useEffect, useRef } from 'react'
import { fetchOddsForCategory } from '../../services/oddsService'
import { getCachedLogo } from '../../services/logoService'
import './TopMatchesCarousel.css'

function TeamLogo({ teamName }) {
  const [src, setSrc] = useState(getCachedLogo(teamName))
  return (
    <img
      src={src}
      alt={teamName}
      className="tmc-team-logo"
      onError={() => setSrc(`https://api.the-odds-api.com/v4/sports
    />
  )
}

export default function TopMatchesCarousel({ sport }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const events = await fetchOddsForCategory(sport)

        const sorted = events.sort((a, b) => {
          if (a.isLive && !b.isLive) return -1
          if (!a.isLive && b.isLive) return 1
          return new Date(a.commenceTime) - new Date(b.commenceTime)
        })
        setMatches(sorted.slice(0, 20))
      } catch (e) {
        setMatches([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [sport])

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' })
    }
  }

  const formatTime = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((d - now) / 60000)
    if (diff <= 0) return 'LIVE'
    if (diff < 60) return `${diff}m`
    if (diff < 1440) return `${Math.floor(diff / 60)}h`
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  if (loading) return (
    <div className="tmc-wrap">
      <div className="tmc-header">
        <h3>Top Matches</h3>
      </div>
      <div className="tmc-skeleton-row">
        {[1,2,3].map(i => <div key={i} className="tmc-skeleton-card" />)}
      </div>
    </div>
  )

  if (!matches.length) return null

  return (
    <div className="tmc-wrap">
      <div className="tmc-header">
        <div className="tmc-title">
          <h3>Top Matches</h3>
        </div>
        <div className="tmc-nav">
          <button className="tmc-nav-btn" onClick={() => scroll(-1)}>‹</button>
          <button className="tmc-nav-btn" onClick={() => scroll(1)}>›</button>
        </div>
      </div>

      <div className="tmc-scroll" ref={scrollRef}>
        {matches.map(match => {
          const outcomes = match.odds ? Object.entries(match.odds) : []
          const isLive = match.isLive
          const timeLabel = formatTime(match.commenceTime)

          return (
            <div key={match.id} className={`tmc-card ${isLive ? 'tmc-card--live' : ''}`}>

              <div className="tmc-card-top">
                <span className={`tmc-time-badge ${isLive ? 'tmc-live' : ''}`}>
                  {isLive ? '🔴 LIVE' : timeLabel}
                </span>
                <span className="tmc-league">{match.leagueInfo?.league}</span>
              </div>


              <div className="tmc-teams">
                <div className="tmc-team">
                  <TeamLogo teamName={match.homeTeam} />
                  <span className="tmc-team-name">{match.homeTeam}</span>
                </div>
                <div className="tmc-vs">VS</div>
                <div className="tmc-team tmc-team--right">
                  <TeamLogo teamName={match.awayTeam} />
                  <span className="tmc-team-name">{match.awayTeam}</span>
                </div>
              </div>


              <div className="tmc-odds">
                {outcomes.slice(0, 3).map(([name, price]) => {
                  const label = name.toLowerCase() === 'draw'
                    ? 'Draw'
                    : name.split(' ')[0]
                  return (
                    <div key={name} className="tmc-odds-btn">
                      <span className="tmc-odds-label">{label}</span>
                      <span className="tmc-odds-val">{Number(price).toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
