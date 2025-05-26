import { useRef, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { initializeAuthState } from './authStateInitializer';

interface UseAuthStateListenerProps {
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStateListener = ({
  setUser,
  setProfile,
  setSession,
  setIsAdmin,
  setLoading
}: UseAuthStateListenerProps) => {
  const navigate = useNavigate();
  const authListenerRef = useRef<(() => void) | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    let isComponentMounted = true;

    async function setup() {
      if (!isComponentMounted || isInitializedRef.current) return;

      console.log('Setting up auth state listener');

      // Clear previous listener if any
      if (authListenerRef.current) {
        authListenerRef.current();
      }

      // Initialize auth state and set listener
      const unsubscribe = await initializeAuthState({
        setUser,
        setProfile,
        setSession,
        setIsAdmin,
        setLoading,
        navigate
      });

      authListenerRef.current = unsubscribe;
      isInitializedRef.current = true;
    }

    setup();

    return () => {
      isComponentMounted = false;
      if (authListenerRef.current) {
        authListenerRef.current();
        authListenerRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [navigate, setUser, setProfile, setSession, setIsAdmin, setLoading]);
};
