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
  navigate,
}: AuthListenerProps) => {
  let lastEvent: string | null = null;

  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, authSession) => {
      if (event === lastEvent) {
        // Prevent handling duplicate events rapidly
        return;
      }
      lastEvent = event;

      console.log('Auth state changed:', event, 'for user:', authSession?.user?.email);

      switch (event) {
        case 'SIGNED_IN':
          if (authSession) {
            setLoading(true);
            await updateAuthState(authSession, setUser, setSession, setProfile, setIsAdmin);
            setLoading(false);

            const isAdminUser =
              authSession.user?.app_metadata?.role === 'admin' ||
              authSession.user?.user_metadata?.role === 'admin' ||
              authSession.user?.email === 'muslimkaki@gmail.com';

            if (window.location.pathname !== (isAdminUser ? '/admin' : '/')) {
              navigate(isAdminUser ? '/admin' : '/', { replace: true });
            }
          }
          break;

        case 'SIGNED_OUT':
          setUser(null);
          setProfile(null);
          setSession(null);
          setIsAdmin(false);

          if (window.location.pathname !== '/login') {
            navigate('/login', { replace: true });
          }
          break;

        case 'TOKEN_REFRESHED':
          if (authSession) {
            setSession(authSession);
            setUser(authSession.user);
          }
          break;

        case 'USER_UPDATED':
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

          if (window.location.pathname !== '/login') {
            navigate('/login', { replace: true });
          }
          break;
      }
    }
  );

  return () => {
    if (authListener && authListener.subscription) {
      authListener.subscription.unsubscribe();
    }
  };
};
