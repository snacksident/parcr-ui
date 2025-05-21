import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubData } from '../context/GlobalStateContext'
import '../App.css'

export default function Login() {
  const navigate = useNavigate()
  const { updateUserData } = useClubData()
  const [initials, setInitials] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!initials.trim()) {
      setError('Please enter your initials');
      return
    }

    // Store user data in global state
    updateUserData({
      initials: initials.toUpperCase(),
      isLoggedIn: true
    })

    navigate('/scan')
  }

  return (
    <div className="container">
      <h1 className="pageTitle">Welcome to PARCR</h1>
      
      <section className="formSection">
        <form onSubmit={handleSubmit}>
          <div className="formField">
            <label htmlFor="initials" className="formLabel">
              ENTER YOUR INITIALS:
            </label>
            <input
              type="text"
              id="initials"
              value={initials}
              onChange={(e) => {
                setInitials(e.target.value.slice(0, 3));
                setError('');
              }}
              className="formInput"
              placeholder="e.g. JDB"
              maxLength={3}
              autoFocus
            />
            {error && <div className="error">{error}</div>}
          </div>
          
          <button type="submit" className="submitButton">
            Start Listing
          </button>
        </form>
      </section>
    </div>
  )
}
