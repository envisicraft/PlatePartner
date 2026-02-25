import React from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App.jsx'
import './index.css' // Your Tailwind or global styles

const ErrorFallback = ({ error }) => {
    return (
        <div style={{ padding: 20, color: 'red', background: 'white', position: 'absolute', inset: 0, zIndex: 99999 }}>
            <h2>Something went wrong:</h2>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
            <pre style={{ fontSize: 10, marginTop: 20 }}>{error.stack}</pre>
        </div>
    );
};

/**
 * Ignition Logic: Mounts the Dining Architect 
 * Command Center (App.jsx) to the DOM.
 */

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)