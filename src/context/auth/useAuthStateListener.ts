
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

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      if (!mounted) return;
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
          await updateAuthState(currentSession, setUser, setSession, setProfile, setIsAdmin);
          
          // Handle redirection if on login page
          if (location.pathname === '/login') {
            const isAdminUser = 
              currentSession.user.app_metadata?.role === 'admin' || 
              currentSession.user.user_metadata?.role === 'admin' ||
              currentSession.user.email === 'muslimkaki@gmail.com';
            
            navigate(isAdminUser ? '/admin' : '/', { replace: true });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
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
        console.log('Auth state changed:', event);
        
        if (!mounted) return;
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            if (authSession) {
              setLoading(true);
              await updateAuthState(authSession, setUser, setSession, setProfile, setIsAdmin);
              setLoading(false);
              
              // Redirect on sign in if on login page
              if (location.pathname === '/login') {
                const isAdminUser = 
                  authSession.user?.app_metadata?.role === 'admin' || 
                  authSession.user?.user_metadata?.role === 'admin' ||
                  authSession.user?.email === 'muslimkaki@gmail.com';
                  
                navigate(isAdminUser ? '/admin' : '/', { replace: true });
              }
            }
            break;
            
          case 'SIGNED_OUT':
            // Clear user data on sign out
            setUser(null);
            setProfile(null);
            setSession(null);
            setIsAdmin(false);
            
            // Reset Supabase auth (this helps with subsequent logins)
            await supabase.auth.signOut({ scope: 'local' });
            
            // Redirect to login page on sign out
            if (location.pathname !== '/welcome' && location.pathname !== '/login') {
              navigate('/login', { replace: true });
            }
            break;
            
          case 'TOKEN_REFRESHED':
            // Just update the session
            if (authSession) {
              setSession(authSession);
            }
            break;
            
          case 'USER_UPDATED':
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
      mounted = false;
      // Clean up auth listener
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
      }
    };
  }, [navigate, location.pathname, setUser, setProfile, setSession, setIsAdmin, setLoading]);
};
