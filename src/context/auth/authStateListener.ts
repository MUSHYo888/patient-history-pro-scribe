
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

export const setupAuthListener = ({
  setUser,
  setProfile,
  setSession,
  setIsAdmin,
  setLoading,
  navigate
}: AuthListenerProps) => {
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, authSession) => {
    console.log('Auth state changed:', event, 'for user:', authSession?.user?.email);
    
    setLoading(true); // Start loading on any auth event

    try {
      switch (event) {
        case 'SIGNED_IN':
          if (authSession) {
            console.log('SIGNED_IN event detected');
            await updateAuthState(authSession, setUser, setSession, setProfile, setIsAdmin);
            const isAdminUser = 
              authSession.user?.app_metadata?.role === 'admin' || 
              authSession.user?.user_metadata?.role === 'admin' ||
              authSession.user?.email === 'muslimkaki@gmail.com';
            console.log('Redirecting after sign in to:', isAdminUser ? '/admin' : '/');  
            navigate(isAdminUser ? '/admin' : '/', { replace: true });
          }
          break;
          
        case 'SIGNED_OUT':
          console.log('SIGNED_OUT event detected');
          setUser(null);
          setProfile(null);
          setSession(null);
          setIsAdmin(false);
          console.log('Redirecting to login page after sign out');
          navigate('/login', { replace: true });
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('TOKEN_REFRESHED event detected');
          if (authSession) {
            setSession(authSession);
            setUser(authSession.user);
          }
          break;
          
        case 'USER_UPDATED':
          console.log('USER_UPDATED event detected');
          if (authSession?.user) {
            setUser(authSession.user);
            setSession(authSession);
            const profileData = await fetchUserProfile(authSession.user.id);
            setProfile(profileData || null);
            setIsAdmin(
              profileData?.role === 'admin' || 
              authSession.user.app_metadata?.role === 'admin' || 
              authSession.user.user_metadata?.role === 'admin' || 
              authSession.user.email === 'muslimkaki@gmail.com'
            );
          }
          break;
          
        case 'PASSWORD_RECOVERY':
          setUser(null);
          setProfile(null);
          setSession(null);
          setIsAdmin(false);
          navigate('/login', { replace: true });
          break;

        default:
          console.log('Unhandled auth event:', event);
          break;
      }
    } catch (error) {
      console.error('Error handling auth event:', event, error);
      // On error, clear auth state as a safe fallback
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);
      navigate('/login', { replace: true });
    } finally {
      setLoading(false); // Always turn off loading at the end
    }
  });

  return () => {
    if (authListener && authListener.subscription) {
      authListener.subscription.unsubscribe();
    }
  };
};
