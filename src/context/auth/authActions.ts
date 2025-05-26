// src/auth/authActions.ts 
import { supabase } from './supabaseClient';
import { createStandaloneToast } from '@chakra-ui/react';

const toast = createStandaloneToast();

export const signIn = async (emailOrUsername, password, setLoading) => { try { setLoading(true); const { data, error } = await supabase.auth.signInWithPassword({ email: emailOrUsername, password });

if (error) {
  console.error('Sign in error:', error.message);
  toast({
    title: 'Login Failed',
    description: error.message,
    status: 'error',
    duration: 3000,
    isClosable: true
  });
  return { error };
}

console.log('Sign in success:', data);
return { data };

} catch (err) { console.error('Unexpected sign-in error:', err); toast({ title: 'Unexpected Error', description: 'Something went wrong. Please try again.', status: 'error', duration: 3000, isClosable: true }); return { error: err }; } finally { setLoading(false); } };

export const signOut = async ( setLoading, setUser, setProfile, setSession, setIsAdmin, navigate, toast ) => { try { setLoading(true); const { error } = await supabase.auth.signOut();

if (error) {
  console.error('Sign out error:', error.message);
  toast({
    title: 'Logout Failed',
    description: error.message,
    status: 'error',
    duration: 3000,
    isClosable: true
  });
  return;
}

console.log('User signed out successfully');

setUser(null);
setProfile(null);
setSession(null);
setIsAdmin(false);

navigate('/login');

} catch (err) { console.error('Unexpected sign-out error:', err); toast({ title: 'Unexpected Error', description: 'Something went wrong. Please try again.', status: 'error', duration: 3000, isClosable: true }); } finally { setLoading(false); } };

