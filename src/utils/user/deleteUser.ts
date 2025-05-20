
import { getSupabaseClient } from './supabaseClient';

export const deleteUser = async (userId: string) => {
  const supabase = getSupabaseClient();
  
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
