
import { createRoot } from 'react-dom/client'
import { Navigate, useLocation } from 'react-router-dom';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Redirect to welcome page on first visit
if (window.location.pathname === '/') {
  window.location.href = '/welcome';
}
