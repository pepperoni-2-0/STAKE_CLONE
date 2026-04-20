import React from 'react'

export default function SkeletonLoader() {
  return (
    <div>
      <div className="skeleton skeleton-bar" />
      {[1, 2, 3].map((group) => (
        <div key={group} style={{ marginBottom: 24 }}>
          <div className="skeleton skeleton-header" />
          {[1, 2, 3].map((row) => (
            <div key={row} className="skeleton skeleton-row" />
          ))}
        </div>
      ))}
    </div>
  )
}
