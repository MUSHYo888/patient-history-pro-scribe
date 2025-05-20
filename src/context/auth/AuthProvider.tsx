
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (data) {
            setProfile(data);
            setIsAdmin(data.role === 'admin');
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
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(data || null);
        setIsAdmin(data?.role === 'admin' || false);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (emailOrUsername: string, password: string) => {
    console.log('Signing in with:', emailOrUsername);
    
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
    
    // Redirect based on user role
    if (data.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profileData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
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
