import React, { createContext, useContext, useState } from 'react'

const GlobalStateContext = createContext()

export function GlobalStateProvider({ children }) {
  const [clubData, setClubData] = useState({
    sku: '',
    productType: '',
    manufacturer: '',
    requiredFields: {},
    specs: {},
    images: []
  })

  const updateClubData = (data) => {
    setClubData(prev => ({
      ...prev,
      ...data
    }))
    console.log('Updated clubData:', {
      ...clubData,
      ...data
    })
  }

  const resetClubData = () => {
    setClubData({
      sku: '',
      productType: '',
      manufacturer: '',
      requiredFields: {},
      specs: {},
      images: []
    })
  }

  return (
    <GlobalStateContext.Provider value={{ 
      clubData, 
      updateClubData,
      resetClubData 
    }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export function useClubData() {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useClubData must be used within a GlobalStateProvider')
  }
  return context
}