
import { User, Session } from '@supabase/supabase-js';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { updateAuthState } from './utils';
import { setupAuthListener } from './authStateListener';

interface AuthStateInitializerProps {
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
  navigate: NavigateFunction;
}

// This function handles the initialization of auth state
export const initializeAuthState = async ({
  setUser,
  setProfile,
  setSession,
  setIsAdmin,
  setLoading,
  navigate
}: AuthStateInitializerProps) => {
  console.log('Initializing auth state');
  setLoading(true);
  
  try {
    // Get current session
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      setLoading(false);
      return;
    }

    if (currentSession) {
      console.log('Found existing session:', currentSession.user.email);
      await updateAuthState(currentSession, setUser, setSession, setProfile, setIsAdmin);
    } else {
      console.log('No session found during initialization');
      // Clear auth state
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
    // Reset auth state on error
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsAdmin(false);
  } finally {
    setLoading(false);
  }
  
  // Set up the auth listener
  return setupAuthListener({
    setUser,
    setProfile,
    setSession,
    setIsAdmin,
    setLoading,
    navigate
  });
};
