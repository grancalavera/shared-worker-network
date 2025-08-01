import React from 'react'
import ReactDOM from 'react-dom/client'
import PortApp from './PortApp.tsx'
import './styles/port.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PortApp />
  </React.StrictMode>,
)