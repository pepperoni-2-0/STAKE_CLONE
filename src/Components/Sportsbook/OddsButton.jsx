import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function OddsButton({ label, value, selected, onClick, prevValue }) {
  const flashClass = useRef('')

  useEffect(() => {
    if (prevValue !== undefined && prevValue !== null && prevValue !== value) {
      flashClass.current = value > prevValue ? 'odds-flash-up' : 'odds-flash-down'
      const timer = setTimeout(() => { flashClass.current = '' }, 700)
      return () => clearTimeout(timer)
    }
  }, [value, prevValue])

  if (value === undefined || value === null) return null

  return (
    <motion.button
      className={`odds-btn ${selected ? 'selected' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <span className="odds-label">{label}</span>
      <span className={`odds-value ${flashClass.current}`}>
        {Number(value).toFixed(2)}
      </span>
    </motion.button>
  )
}
