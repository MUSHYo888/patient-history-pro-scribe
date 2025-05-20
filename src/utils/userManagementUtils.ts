
import { createClient } from '@supabase/supabase-js';

// Set Supabase credentials from user input
const SUPABASE_URL = 'https://lryjqfwkyerivzebacwv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWpxZndreWVyaXZ6ZWJhY3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3ODA3NDMsImV4cCI6MjA2MzM1Njc0M30.RutX-wO0GNSyFzMolNErWYKIX_r-b4oFfQ76in4qiEA';

export interface UserData {
  id?: string;
  email: string;
  full_name: string;
  role: string;
}

export const createUser = async (email: string, password: string, fullName: string, role: string) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (error) throw error;

  // Add user to profiles table with role
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: data.user.id, email, full_name: fullName, role }
      ]);

    if (profileError) throw profileError;
  }

  return data;
};

export const updateUser = async (userId: string, password: string | null, fullName: string, role: string) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Update auth if password is provided
  if (password) {
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password }
    );
    if (error) throw error;
  }

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ full_name: fullName, role })
    .eq('id', userId);

  if (profileError) throw profileError;

  return { success: true };
};
