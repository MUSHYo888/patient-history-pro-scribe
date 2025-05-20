
import { createClient } from '@supabase/supabase-js';

// Set Supabase credentials from user input
const SUPABASE_URL = 'https://lryjqfwkyerivzebacwv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWpxZndreWVyaXZ6ZWJhY3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3ODA3NDMsImV4cCI6MjA2MzM1Njc0M30.RutX-wO0GNSyFzMolNErWYKIX_r-b4oFfQ76in4qiEA';

export interface UserData {
  id?: string;
  email: string;
  full_name: string;
  role: string;
  description?: string;
  username?: string;
}

// Initialize pre-defined accounts when the app starts
export const initializePredefinedAccounts = async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Check if admin account exists in profiles table
    const { data: adminData } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'muslimkaki@gmail.com')
      .single();
    
    // If admin account doesn't exist in profiles, try to create it
    if (!adminData) {
      try {
        // First try regular signup
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'muslimkaki@gmail.com',
          password: '12345',
        });
        
        if (signUpError) throw signUpError;
        
        // If successful, add to profiles table
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ 
              id: signUpData.user.id, 
              email: 'muslimkaki@gmail.com', 
              full_name: 'Admin User', 
              role: 'admin',
              description: 'Main administrator account'
            }]);
          
          if (profileError) throw profileError;
          
          console.log('Admin account created successfully');
        }
      } catch (error) {
        console.error('Error creating admin account:', error);
      }
    }
    
    // Check if user account exists
    const { data: userData } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', '99120105')
      .single();
    
    // Create normal user account if it doesn't exist
    if (!userData) {
      try {
        // Try regular signup
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'user@example.com',
          password: '12345',
        });
        
        if (signUpError) throw signUpError;
        
        // If successful, add to profiles table
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ 
              id: signUpData.user.id, 
              email: 'user@example.com', 
              full_name: 'Standard User', 
              role: 'user',
              description: 'Regular user account',
              username: '99120105'
            }]);
          
          if (profileError) throw profileError;
          
          console.log('Standard user account created successfully');
        }
      } catch (error) {
        console.error('Error creating user account:', error);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error initializing predefined accounts:', error);
    return { success: false, error };
  }
};

export const createUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  role: string, 
  description: string = '', 
  username: string = ''
) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Create new user with regular signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { 
        full_name: fullName,
        username: username || undefined
      }
    }
  });

  if (error) throw error;

  // Add user to profiles table with role
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user.id, 
          email, 
          full_name: fullName, 
          role,
          description,
          username: username || null
        }
      ]);

    if (profileError) throw profileError;
  }

  return data;
};

export const updateUser = async (
  userId: string, 
  password: string | null, 
  fullName: string, 
  role: string, 
  description: string = '',
  username: string | null = null,
  email: string | null = null
) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Update auth if password is provided
  if (password) {
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password }
    );
    if (error) throw error;
  }

  // Update user data in auth if email is provided
  if (email) {
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { email }
    );
    if (error) throw error;
  }

  // Prepare update data
  const updateData: any = { 
    full_name: fullName, 
    role,
    description
  };
  
  // Only add username if provided
  if (username !== null) {
    updateData.username = username;
  }
  
  // Only add email if provided
  if (email !== null) {
    updateData.email = email;
  }

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId);

  if (profileError) throw profileError;

  return { success: true };
};

export const deleteUser = async (userId: string) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Delete user from Supabase Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) throw authError;
  
  // Delete profile from profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
    
  if (profileError) throw profileError;
  
  return { success: true };
};

export const getUserProfile = async (userId: string) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  
  return data;
};

export const updateUserProfile = async (userId: string, fullName: string, description: string) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name: fullName,
      description 
    })
    .eq('id', userId);
    
  if (error) throw error;
  
  return { success: true };
};
