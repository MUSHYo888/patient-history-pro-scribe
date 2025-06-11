
import { createClient } from '@supabase/supabase-js';

// Set Supabase credentials
const SUPABASE_URL = 'https://lryjqfwkyerivzebacwv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWpxZndreWVyaXZ6ZWJhY3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3ODA3NDMsImV4cCI6MjA2MzM1Njc0M30.RutX-wO0GNSyFzMolNErWYKIX_r-b4oFfQ76in4qiEA';

// Create a single Supabase client instance with auth persistence options
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Export a function to reset auth state without creating new client instances
export const resetSupabaseClient = async () => {
  console.log('Resetting Supabase auth state');
  
  try {
    // Sign out from Supabase - use global scope to invalidate all sessions
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.error('Error during Supabase sign out:', error);
    }
    
    console.log('Successfully reset Supabase auth state');
    return { success: !error };
  } catch (err) {
    console.error('Unexpected error during Supabase reset:', err);
    return { success: false };
  }
};
