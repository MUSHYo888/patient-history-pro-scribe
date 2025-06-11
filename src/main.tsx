
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(<App />);

// Only redirect to welcome if explicitly on root and not authenticated
if (window.location.pathname === '/' && window.location.search === '') {
  // Check if there's any auth data in localStorage first
  const hasAuthData = Object.keys(localStorage).some(key => 
    key.includes('supabase') || key.includes('sb-')
  );
  
  // Only redirect to welcome if no auth data exists
  if (!hasAuthData) {
    window.location.href = '/welcome';
  }
}
