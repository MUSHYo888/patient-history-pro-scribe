
import { User } from '@supabase/supabase-js';
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

// Create minimal profile from user data
export const createMinimalProfile = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    role: user.app_metadata?.role || 'user',
    full_name: user.user_metadata?.full_name || ''
  };
};
