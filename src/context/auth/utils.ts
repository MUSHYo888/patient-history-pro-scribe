
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// Function to fetch user profile
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception when fetching profile:', err);
    return null;
  }
};

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
    
    // Fetch user profile
    const profileData = await fetchUserProfile(currentSession.user.id);
    setProfile(profileData || null);
    setIsAdmin(checkIsAdmin(currentSession.user, profileData));
  } else {
    // Clear auth state
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsAdmin(false);
  }
};
