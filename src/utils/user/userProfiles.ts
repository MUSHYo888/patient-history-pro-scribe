
import { supabase } from './supabaseClient';

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  
  return data;
};

export const updateUserProfile = async (userId: string, fullName: string, description: string) => {
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
