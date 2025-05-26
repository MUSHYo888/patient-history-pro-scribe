import { User, Session } from '@supabase/supabase-js';
import { NavigateFunction } from 'react-router-dom';
import { supabase, resetSupabaseClient } from './supabaseClient';
import { updateAuthState } from './authState';
import { setupAuthListener } from './authStateListener';

interface AuthStateInitializerProps {
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
  navigate: NavigateFunction;
}

// Initialize auth state cleanly
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
    const authTimeout = setTimeout(() => {
      console.warn('Auth init timeout — forcing reset');
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);
      setLoading(false);
      resetSupabaseClient().then(() => {
        if (window.location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      });
    }, 5000);

    // Check existing session
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    clearTimeout(authTimeout);

    if (error) {
      console.error('Error getting session:', error);
      setLoading(false);
      return;
    }

    if (currentSession) {
      console.log('Existing session found:', currentSession.user.email);
      await updateAuthState(currentSession, setUser, setSession, setProfile, setIsAdmin);

      const isAdminUser =
        currentSession.user?.app_metadata?.role === 'admin' ||
        currentSession.user?.user_metadata?.role === 'admin' ||
        currentSession.user?.email === 'muslimkaki@gmail.com';

      const targetPath = isAdminUser ? '/admin' : '/';
      if (window.location.pathname !== targetPath) {
        console.log('Redirecting to correct path:', targetPath);
        navigate(targetPath, { replace: true });
      } else {
        console.log('Already on correct path, no redirect needed.');
      }
    } else {
      console.log('No session found during init');
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);

      if (window.location.pathname !== '/login') {
        console.log('Redirecting to login (no session)');
        navigate('/login', { replace: true });
      }
    }
  } catch (error) {
    console.error('Auth init error:', error);
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsAdmin(false);
  } finally {
    setLoading(false);
  }

  // Attach auth state listener
  return setupAuthListener({
    setUser,
    setProfile,
    setSession,
    setIsAdmin,
    setLoading,
    navigate
  });
};
