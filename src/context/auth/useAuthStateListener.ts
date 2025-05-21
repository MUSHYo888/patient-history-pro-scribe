
import { useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { updateAuthState, fetchUserProfile } from './utils';

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
  const location = useLocation();
  const authListenerRef = useRef<{ subscription: { unsubscribe: () => void } } | null>(null);
  // Track if component is mounted to avoid state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isMountedRef.current) return;
      console.log('Initializing auth state');
      setLoading(true);
      
      try {
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMountedRef.current) setLoading(false);
          return;
        }

        if (currentSession) {
          console.log('Found existing session:', currentSession.user.email);
          await updateAuthState(currentSession, setUser, setSession, setProfile, setIsAdmin);
          
          // Handle redirection if on login page
          if (location.pathname === '/login') {
            const isAdminUser = 
              currentSession.user.app_metadata?.role === 'admin' || 
              currentSession.user.user_metadata?.role === 'admin' ||
              currentSession.user.email === 'muslimkaki@gmail.com';
            
            console.log('Redirecting from login page to:', isAdminUser ? '/admin' : '/');
            navigate(isAdminUser ? '/admin' : '/', { replace: true });
          }
        } else {
          console.log('No session found during initialization');
          // Clear auth state
          setUser(null);
          setProfile(null);
          setSession(null);
          setIsAdmin(false);
          
          // Redirect to login if not on welcome or login page
          if (location.pathname !== '/welcome' && location.pathname !== '/login') {
            console.log('Redirecting to login page - no session');
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const setupAuthListener = () => {
      // Clean up previous listener if exists
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
      }
      
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, authSession) => {
        console.log('Auth state changed:', event, 'for user:', authSession?.user?.email);
        
        if (!isMountedRef.current) return;
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            if (authSession) {
              console.log('SIGNED_IN event detected');
              setLoading(true);
              await updateAuthState(authSession, setUser, setSession, setProfile, setIsAdmin);
              setLoading(false);
              
              // Redirect on sign in if on login page
              if (location.pathname === '/login') {
                const isAdminUser = 
                  authSession.user?.app_metadata?.role === 'admin' || 
                  authSession.user?.user_metadata?.role === 'admin' ||
                  authSession.user?.email === 'muslimkaki@gmail.com';
                
                console.log('Redirecting after sign in to:', isAdminUser ? '/admin' : '/');  
                navigate(isAdminUser ? '/admin' : '/', { replace: true });
              }
            }
            break;
            
          case 'SIGNED_OUT':
            console.log('SIGNED_OUT event detected');
            // Clear user data on sign out
            setUser(null);
            setProfile(null);
            setSession(null);
            setIsAdmin(false);
            
            // Redirect to login page on sign out
            if (location.pathname !== '/welcome' && location.pathname !== '/login') {
              console.log('Redirecting to login page after sign out');
              navigate('/login', { replace: true });
            }
            break;
            
          case 'TOKEN_REFRESHED':
            console.log('TOKEN_REFRESHED event detected');
            // Just update the session
            if (authSession) {
              setSession(authSession);
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
              setIsAdmin(profileData?.role === 'admin' || false);
            }
            break;
        }
      });
      
      authListenerRef.current = authListener;
    };
    
    setupAuthListener();

    return () => {
      isMountedRef.current = false;
      // Clean up auth listener
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
      }
    };
  }, [navigate, location.pathname, setUser, setProfile, setSession, setIsAdmin, setLoading]);
};
