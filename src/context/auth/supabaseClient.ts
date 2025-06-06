
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

// Export a function to completely reset the Supabase client state
export const resetSupabaseClient = async () => {
  console.log('Completely resetting Supabase client state');
  
  try {
    // Sign out from Supabase - use global scope to invalidate all sessions
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.error('Error during Supabase sign out:', error);
    }
    
    // Clear all local storage items related to Supabase
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        console.log(`Clearing localStorage item: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage items related to Supabase
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        console.log(`Clearing sessionStorage item: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
    
    // Reset potential IndexedDB storage
    try {
      const databases = await window.indexedDB.databases();
      databases.forEach(db => {
        if (db.name && (db.name.includes('supabase') || db.name.includes('sb-'))) {
          console.log(`Deleting IndexedDB database: ${db.name}`);
          window.indexedDB.deleteDatabase(db.name);
        }
      });
    } catch (dbErr) {
      console.error("IndexedDB cleanup failed:", dbErr);
      // Continue even if this fails
    }
    
    return { success: !error };
  } catch (err) {
    console.error('Unexpected error during Supabase reset:', err);
    return { success: false };
  }
};
