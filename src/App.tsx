import './App.css'
import React from 'react'
import { QueryProvider } from './app/QueryProvider'
import AppRoutes from './app/routes'

function App() {
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  )
}

export default App
