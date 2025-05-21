
import { User, Session } from '@supabase/supabase-js';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { updateAuthState } from './authState';
import { fetchUserProfile } from './userProfile';

interface AuthListenerProps {
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
  navigate: NavigateFunction;
}

// This function sets up the auth state change listener
export const setupAuthListener = ({
  setUser,
  setProfile,
  setSession,
  setIsAdmin,
  setLoading,
  navigate
}: AuthListenerProps) => {
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
