import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from './Button'

export default function GlobalNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  // Defensive check: Ensure location is defined
  if (!location) {
    console.error('GlobalNavigation: location is undefined.')
    return null;
  }

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  }

  const handleStartOver = () => {
    navigate('/'); // Navigate to the starting page (e.g., Login)
  }

  // Hide navigation on the Login page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '1rem',
        zIndex: 1000,
      }}
    >
      <Button
        onClick={handleBack}
      >
        Back
      </Button>
      <Button
        onClick={handleStartOver}
      >
        Start Over
      </Button>
    </div>
  )
}