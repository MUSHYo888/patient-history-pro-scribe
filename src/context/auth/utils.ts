
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// Function to fetch user profile from auth metadata instead of profiles table
export const fetchUserProfile = async (userId: string) => {
  try {
    // First, try to get the user from auth.users through the admin API
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError) {
      console.error('Error fetching user from auth:', userError);
      
      // Fallback: try to get minimal profile data from the session user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        return null;
      }
      
      if (session?.user && session.user.id === userId) {
        // Create profile from session user data
        return {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || '',
          role: session.user.app_metadata?.role || 'user',
          description: session.user.user_metadata?.description || ''
        };
      }
      
      return null;
    }

    // Return user profile formed from auth data
    return {
      id: userData.user.id,
      email: userData.user.email,
      full_name: userData.user.user_metadata?.full_name || '',
      role: userData.user.app_metadata?.role || 'user',
      description: userData.user.user_metadata?.description || '',
      // Add additional fields as needed
    };
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
