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

    const currentPath = window.location.pathname;

    switch (event) {
      case 'SIGNED_IN':
        if (authSession) {
          console.log('SIGNED_IN event detected');
          setLoading(true);
          await updateAuthState(authSession, setUser, setSession, setProfile, setIsAdmin);
          setLoading(false);

          const isAdminUser =
            authSession.user?.app_metadata?.role === 'admin' ||
            authSession.user?.user_metadata?.role === 'admin' ||
            authSession.user?.email === 'muslimkaki@gmail.com';

          const targetPath = isAdminUser ? '/admin' : '/';
          if (currentPath !== targetPath) {
            console.log('Redirecting after sign in to:', targetPath);
            navigate(targetPath, { replace: true });
          } else {
            console.log('Already on target path, not redirecting.');
          }
        }
        break;

      case 'SIGNED_OUT':
        console.log('SIGNED_OUT event detected');
        setUser(null);
        setProfile(null);
        setSession(null);
        setIsAdmin(false);

        if (currentPath !== '/login') {
          console.log('Redirecting to login page after sign out');
          navigate('/login', { replace: true });
        }
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
        if (currentPath !== '/login') {
          console.log('Redirecting to login page during password recovery');
          navigate('/login', { replace: true });
        }
        break;

      default:
        console.log('Unhandled auth event:', event);
    }
  });

  // Return unsubscribe function
  return () => {
    if (authListener && authListener.subscription) {
      authListener.subscription.unsubscribe();
    }
  };
};
