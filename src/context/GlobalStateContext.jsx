import React, { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [clubData, setClubData] = useState({ sku: '', details: {} });

  return (
    <GlobalStateContext.Provider value={{ currentUser, setCurrentUser, clubData, setClubData }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}