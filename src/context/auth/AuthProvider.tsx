
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
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

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          }

          if (data) {
            setProfile(data);
            setIsAdmin(data.role === 'admin');
          }
          
          // After setting up user data, redirect appropriately if on login page
          if (location.pathname === '/login') {
            if (data?.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile during auth change:', error);
        }

        setProfile(data || null);
        setIsAdmin(data?.role === 'admin' || false);
        
        // Redirect on sign in if on login page
        if (event === 'SIGNED_IN' && location.pathname === '/login') {
          if (data?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
        
        // Redirect to login page on sign out
        if (event === 'SIGNED_OUT' && location.pathname !== '/welcome' && location.pathname !== '/login') {
          navigate('/login');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
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
      
      // Note: Redirect is now handled by the auth state change listener
      // This ensures the redirection happens after all auth-related state is updated
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      // Redirection handled by auth state change listener
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
