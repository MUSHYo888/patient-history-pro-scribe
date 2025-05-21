
import { supabase } from '../../context/auth/supabaseClient';

export const getUserProfile = async (userId: string) => {
  try {
    // First, try to get user data from auth API
    const { data: authData, error: authError } = await supabase.auth.getUser(userId);
    
    if (authError || !authData || !authData.user) {
      console.error('Error getting user from auth API:', authError);
      
      // Fallback: try to get user from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching user from profiles table:', profileError);
        throw new Error('User not found');
      }
      
      return {
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name || '',
        role: profileData.role || 'user',
        description: profileData.description || '',
      };
    }
    
    // Special case for admin user
    if (authData.user.email === 'muslimkaki@gmail.com') {
      return {
        id: authData.user.id,
        email: authData.user.email,
        full_name: authData.user.user_metadata?.full_name || 'Admin User',
        role: 'admin',
        description: authData.user.user_metadata?.description || '',
      };
    }
    
    // Return formatted user data from auth
    return {
      id: authData.user.id,
      email: authData.user.email,
      full_name: authData.user.user_metadata?.full_name || '',
      role: authData.user.app_metadata?.role || 'user',
      description: authData.user.user_metadata?.description || '',
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, fullName: string, description: string) => {
  try {
    // Update both auth metadata and profiles table for completeness
    
    // 1. Update user metadata in auth
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        description: description
      }
    });
    
    if (authError) {
      console.error('Error updating user auth metadata:', authError);
    }
    
    // 2. Update profiles table as backup
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        full_name: fullName, 
        description 
      })
      .eq('id', userId);
      
    if (profileError) {
      console.error('Error updating profiles table:', profileError);
    }
    
    // If both operations failed, throw error
    if (authError && profileError) {
      throw new Error('Failed to update profile');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
