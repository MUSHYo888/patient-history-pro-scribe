
import { User, Session } from '@supabase/supabase-js';
import { fetchUserProfile } from './userProfile';

// Check if user has admin role
export const checkIsAdmin = (
  user: User | null, 
  profileData: any | null
): boolean => {
  if (!user) return false;
  
  return (
    profileData?.role === 'admin' || 
    user.app_metadata?.role === 'admin' || 
    user.user_metadata?.role === 'admin' || 
    user.email === 'muslimkaki@gmail.com'
  );
};

// Update auth state with user information
export const updateAuthState = async (
  currentSession: Session | null,
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setProfile: (profile: any | null) => void,
  setIsAdmin: (isAdmin: boolean) => void
) => {
  if (currentSession?.user) {
    setUser(currentSession.user);
    setSession(currentSession);
    
    try {
      // Fetch user profile
      const profileData = await fetchUserProfile(currentSession.user.id);
      
      // Special case for muslimkaki@gmail.com - always treat as admin
      if (currentSession.user.email === 'muslimkaki@gmail.com') {
        const adminProfile = {
          ...(profileData || {}),
          id: currentSession.user.id,
          email: currentSession.user.email,
          role: 'admin',
          full_name: profileData?.full_name || 'Admin User'
        };
        setProfile(adminProfile);
        setIsAdmin(true);
      } else {
        setProfile(profileData || null);
        setIsAdmin(checkIsAdmin(currentSession.user, profileData));
      }
    } catch (err) {
      console.error('Error updating auth state:', err);
      
      // Create minimal profile from user data
      const minimalProfile = {
        id: currentSession.user.id,
        email: currentSession.user.email,
        role: currentSession.user.app_metadata?.role || 'user',
        full_name: currentSession.user.user_metadata?.full_name || ''
      };
      
      setProfile(minimalProfile);
      setIsAdmin(checkIsAdmin(currentSession.user, minimalProfile));
    }
  } else {
    // Clear auth state
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsAdmin(false);
  }
};
