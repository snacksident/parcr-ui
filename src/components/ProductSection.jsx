import React from 'react'

export default function ProductSection({ title, clubData }) {
  return (
    <section className="section">
      <div className="sectionHeader">
        <h2 className="sectionTitle">{title}</h2>
      </div>
      <div className="sectionContent">
        {Object.entries(clubData).map(([key, value]) => (
          <div key={key} className="infoRow">
            <span className="label">{key.toUpperCase()}:</span>
            <span className="value">{value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
