
import { NavigateFunction } from 'react-router-dom';
import { supabase, resetSupabaseClient } from './supabaseClient';
import { ToastType } from './types';

// Sign in function
export const signIn = async (
  emailOrUsername: string, 
  password: string, 
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  console.log('Signing in with:', emailOrUsername);
  
  try {
    // Ensure a clean state before sign in
    await resetSupabaseClient();
    
    // First try to sign in with email
    let { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrUsername,
      password,
    });

    // If email sign in fails, check if it's a username
    if (error && emailOrUsername.indexOf('@') === -1) {
      console.log('Email sign in failed, trying username lookup');
      // Look up the email for this username
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername)
        .single();
      
      if (userError) {
        console.error('Username lookup error:', userError);
        throw new Error('Invalid username or password');
      }
      
      if (userData && userData.email) {
        console.log('Found email for username:', userData.email);
        // Try again with the found email
        const result = await supabase.auth.signInWithPassword({
          email: userData.email,
          password,
        });
        
        data = result.data;
        error = result.error;
      } else {
        throw new Error('Username not found');
      }
    }

    if (error) {
      console.error('Final login error:', error);
      throw error;
    }
    
    console.log('Login successful');
    // Auth state and redirect handled by auth state change listener
    
  } catch (error: any) {
    // Set loading to false if there's an error
    setLoading(false);
    throw error;
  }
};

// Sign out function with comprehensive cleanup
export const signOut = async (
  setLoading: (loading: boolean) => void,
  setUser: (user: null) => void,
  setProfile: (profile: null) => void,
  setSession: (session: null) => void,
  setIsAdmin: (isAdmin: boolean) => void,
  navigate: NavigateFunction,
  toast: ToastType
) => {
  try {
    console.log("Starting signOut process");
    setLoading(true);
    
    // First clear auth state before API calls
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsAdmin(false);
    
    // Use the centralized reset function that handles everything
    const { success } = await resetSupabaseClient();
    
    if (!success) {
      console.error("Supabase client reset had issues");
    }
    
    console.log("Successfully signed out, redirecting to login");
    
    // Force navigation to login page
    navigate('/login', { replace: true });
    
    toast.toast({
      title: "Signed out successfully",
      description: "You have been logged out",
    });
    
  } catch (error: any) {
    console.error("Sign out failed:", error);
    toast.toast({
      variant: "destructive",
      title: "Sign out failed",
      description: error.message,
    });
  } finally {
    setLoading(false);
  }
};

// Update user profile function
export const updateProfile = async (
  userId: string,
  fullName: string, 
  description: string,
  setProfile: (profile: any) => void,
  profile: any,
  toast: ToastType
) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: fullName, 
        description 
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    // Update the profile state
    setProfile({
      ...profile,
      full_name: fullName,
      description
    });
    
    toast.toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
    
  } catch (error: any) {
    toast.toast({
      variant: "destructive",
      title: "Update failed",
      description: error.message,
    });
  }
};
