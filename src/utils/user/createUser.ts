
import { supabase } from './supabaseClient';

export const createUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  role: string, 
  description: string = '', 
  username: string = ''
) => {
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
