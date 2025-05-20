
import { getSupabaseClient } from './supabaseClient';

export const updateUser = async (
  userId: string, 
  password: string | null, 
  fullName: string, 
  role: string, 
  description: string = '',
  username: string | null = null,
  email: string | null = null
) => {
  const supabase = getSupabaseClient();
  
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
