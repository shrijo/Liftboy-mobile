import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode intentionally omitted: double-mounting creates duplicate AudioContexts
createRoot(document.getElementById('root')!).render(<App />)
