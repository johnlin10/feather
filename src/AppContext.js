// AppContext.js
import React, { createContext, useEffect, useState } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  })
  // 打包狀態和狀態設置函數
  const value = { userLocation, setUserLocation }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
