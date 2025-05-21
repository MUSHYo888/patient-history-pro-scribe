
import React, { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthProviderProps } from './types';
import { supabase } from './supabaseClient';
import AuthContext from './AuthContext';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const authListenerRef = useRef<{ subscription: { unsubscribe: () => void } } | null>(null);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Exception when fetching profile:', err);
      return null;
    }
  };

  // Function to update auth state with user information
  const updateAuthState = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      setUser(currentSession.user);
      setSession(currentSession);
      
      // Fetch user profile
      const profileData = await fetchUserProfile(currentSession.user.id);
      setProfile(profileData || null);
      setIsAdmin(
        profileData?.role === 'admin' || 
        currentSession.user.app_metadata?.role === 'admin' || 
        currentSession.user.user_metadata?.role === 'admin' || 
        currentSession.user.email === 'muslimkaki@gmail.com'
      );
    } else {
      // Clear auth state
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      if (!mounted) return;
      setLoading(true);
      
      try {
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (currentSession) {
          await updateAuthState(currentSession);
          
          // Handle redirection if on login page
          if (location.pathname === '/login') {
            const isAdminUser = 
              currentSession.user.app_metadata?.role === 'admin' || 
              currentSession.user.user_metadata?.role === 'admin' ||
              currentSession.user.email === 'muslimkaki@gmail.com';
            
            navigate(isAdminUser ? '/admin' : '/', { replace: true });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const setupAuthListener = () => {
      // Clean up previous listener if exists
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
      }
      
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, authSession) => {
        console.log('Auth state changed:', event);
        
        if (!mounted) return;
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            if (authSession) {
              setLoading(true);
              await updateAuthState(authSession);
              setLoading(false);
              
              // Redirect on sign in if on login page
              if (location.pathname === '/login') {
                const isAdminUser = 
                  authSession.user?.app_metadata?.role === 'admin' || 
                  authSession.user?.user_metadata?.role === 'admin' ||
                  authSession.user?.email === 'muslimkaki@gmail.com';
                  
                navigate(isAdminUser ? '/admin' : '/', { replace: true });
              }
            }
            break;
            
          case 'SIGNED_OUT':
            // Clear user data on sign out
            setUser(null);
            setProfile(null);
            setSession(null);
            setIsAdmin(false);
            
            // Reset Supabase auth (this helps with subsequent logins)
            await supabase.auth.signOut({ scope: 'local' });
            
            // Redirect to login page on sign out
            if (location.pathname !== '/welcome' && location.pathname !== '/login') {
              navigate('/login', { replace: true });
            }
            break;
            
          case 'TOKEN_REFRESHED':
            // Just update the session
            if (authSession) {
              setSession(authSession);
            }
            break;
            
          case 'USER_UPDATED':
            // Refresh user profile if user data was updated
            if (authSession?.user) {
              setUser(authSession.user);
              setSession(authSession);
              const profileData = await fetchUserProfile(authSession.user.id);
              setProfile(profileData || null);
              setIsAdmin(profileData?.role === 'admin' || false);
            }
            break;
        }
      });
      
      authListenerRef.current = authListener;
    };
    
    setupAuthListener();

    return () => {
      mounted = false;
      // Clean up auth listener
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
      }
    };
  }, [navigate, location.pathname]);

  const signIn = async (emailOrUsername: string, password: string) => {
    setLoading(true);
    console.log('Signing in with:', emailOrUsername);
    
    try {
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

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Explicitly clear state before calling signOut to prevent stale state
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'local' });
      
      // Force navigation to login page
      navigate('/login', { replace: true });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (fullName: string, description: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName, 
          description 
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update the profile state
      setProfile({
        ...profile,
        full_name: fullName,
        description
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
