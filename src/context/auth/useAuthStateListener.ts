
import { useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { NavigateFunction, useNavigate, useLocation } from 'react-router-dom';
import { supabase, resetSupabaseClient } from './supabaseClient';
import { updateAuthState, fetchUserProfile } from './utils';

interface UseAuthStateListenerProps {
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
}

// This function handles the initialization of auth state
export const initializeAuthState = async ({
  setUser,
  setProfile,
  setSession,
  setIsAdmin,
  setLoading,
  navigate
}: UseAuthStateListenerProps & { navigate: NavigateFunction }) => {
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
    }, 10000); // 10 seconds timeout
    
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

// This function sets up the auth state change listener
export const setupAuthListener = ({
  setUser,
  setProfile,
  setSession,
  setIsAdmin,
  setLoading,
  navigate
}: UseAuthStateListenerProps & { navigate: NavigateFunction }) => {
  // Set up auth state change listener
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, authSession) => {
    console.log('Auth state changed:', event, 'for user:', authSession?.user?.email);
    
    // Handle different auth events
    switch (event) {
      case 'SIGNED_IN':
        if (authSession) {
          console.log('SIGNED_IN event detected');
          setLoading(true);
          await updateAuthState(authSession, setUser, setSession, setProfile, setIsAdmin);
          setLoading(false);
          
          // Check if the user is an admin
          const isAdminUser = 
            authSession.user?.app_metadata?.role === 'admin' || 
            authSession.user?.user_metadata?.role === 'admin' ||
            authSession.user?.email === 'muslimkaki@gmail.com';
          
          // Redirect after sign in
          console.log('Redirecting after sign in to:', isAdminUser ? '/admin' : '/');  
          navigate(isAdminUser ? '/admin' : '/', { replace: true });
        }
        break;
        
      case 'SIGNED_OUT':
        console.log('SIGNED_OUT event detected');
        // Clear user data on sign out
        setUser(null);
        setProfile(null);
        setSession(null);
        setIsAdmin(false);
        
        // Clear any Supabase local storage
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
        
        // Redirect to login page on sign out
        console.log('Redirecting to login page after sign out');
        navigate('/login', { replace: true });
        break;
        
      case 'TOKEN_REFRESHED':
        console.log('TOKEN_REFRESHED event detected');
        // Update the session and user data
        if (authSession) {
          setSession(authSession);
          setUser(authSession.user);
        }
        break;
        
      case 'USER_UPDATED':
        console.log('USER_UPDATED event detected');
        // Refresh user profile if user data was updated
        if (authSession?.user) {
          setUser(authSession.user);
          setSession(authSession);
          const profileData = await fetchUserProfile(authSession.user.id);
          setProfile(profileData || null);
          setIsAdmin(profileData?.role === 'admin' || 
                    authSession.user.app_metadata?.role === 'admin' || 
                    authSession.user.user_metadata?.role === 'admin' || 
                    authSession.user.email === 'muslimkaki@gmail.com');
        }
        break;
        
      case 'PASSWORD_RECOVERY':
      case 'USER_DELETED':
        // Clear auth state for these events
        setUser(null);
        setProfile(null);
        setSession(null);
        setIsAdmin(false);
        navigate('/login', { replace: true });
        break;
    }
  });
  
  // Return the unsubscribe function
  return () => {
    if (authListener && authListener.subscription) {
      authListener.subscription.unsubscribe();
    }
  };
};

// Original hook for compatibility - now a simplified wrapper
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
