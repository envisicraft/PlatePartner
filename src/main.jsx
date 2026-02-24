import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Your Tailwind or global styles

/**
 * Ignition Logic: Mounts the Dining Architect 
 * Command Center (App.jsx) to the DOM.
 */

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)