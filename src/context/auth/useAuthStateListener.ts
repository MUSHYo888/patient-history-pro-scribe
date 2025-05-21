
import { useRef, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { initializeAuthState } from './authStateInitializer';

interface UseAuthStateListenerProps {
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
}

// Simplified hook that uses the extracted modules
export const useAuthStateListener = ({
  setUser,
  setProfile,
  setSession,
  setIsAdmin,
  setLoading
}: UseAuthStateListenerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authListenerRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    let isComponentMounted = true;
    
    async function setup() {
      if (!isComponentMounted) return;
      
      // Clear any subscription
      if (authListenerRef.current) {
        authListenerRef.current();
      }
      
      // Only initialize if component is still mounted
      if (isComponentMounted) {
        initializeAuthState({
          setUser, 
          setProfile, 
          setSession, 
          setIsAdmin, 
          setLoading,
          navigate
        }).then(unsubscribe => {
          authListenerRef.current = unsubscribe;
        });
      }
    }
    
    setup();
    
    // Cleanup
    return () => {
      isComponentMounted = false;
      if (authListenerRef.current) {
        authListenerRef.current();
      }
    };
  }, [navigate, location.pathname, setUser, setProfile, setSession, setIsAdmin, setLoading]);
};

// Re-export the initialization function for direct use
export { initializeAuthState } from './authStateInitializer';
// Re-export the auth listener for direct use
export { setupAuthListener } from './authStateListener';
