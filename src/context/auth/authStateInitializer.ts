
import { User, Session } from '@supabase/supabase-js';
import { NavigateFunction } from 'react-router-dom';
import { supabase, resetSupabaseClient } from './supabaseClient';
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
    // Set a timeout to prevent the app from getting stuck in loading
    const authTimeout = setTimeout(() => {
      console.log('Auth initialization timeout - forcing auth state reset');
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);
      setLoading(false);
      
      // Reset the client to clear any potential issues
      resetSupabaseClient().then(() => {
        navigate('/login', { replace: true });
      });
    }, 5000); // Reduced from 10s to 5s for faster feedback
    
    // Get current session
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    
    // Clear the timeout since we got a response
    clearTimeout(authTimeout);
    
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
