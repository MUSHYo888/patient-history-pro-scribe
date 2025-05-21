
import { supabase } from './supabaseClient';

export const getUserProfile = async (userId: string) => {
  try {
    // Get user data from auth API
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error) {
      console.error('Error getting user from auth:', error);
      throw error;
    }
    
    if (!data || !data.user) {
      throw new Error('User not found');
    }
    
    // Return formatted user data
    return {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name || '',
      role: data.user.app_metadata?.role || 'user',
      description: data.user.user_metadata?.description || '',
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, fullName: string, description: string) => {
  try {
    // Update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          full_name: fullName,
          description: description
        }
      }
    );
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
