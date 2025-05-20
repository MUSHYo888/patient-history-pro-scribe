
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Set Supabase credentials from user input
const SUPABASE_URL = 'https://lryjqfwkyerivzebacwv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWpxZndreWVyaXZ6ZWJhY3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3ODA3NDMsImV4cCI6MjA2MzM1Njc0M30.RutX-wO0GNSyFzMolNErWYKIX_r-b4oFfQ76in4qiEA';

// Create a single Supabase client instance
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  signIn: (emailOrUsername: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  updateProfile: (fullName: string, description: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Add the predefined accounts directly in AuthContext to ensure they are properly set
const predefinedAccounts = [
  {
    email: 'muslimkaki@gmail.com',
    password: '12345',
    full_name: 'Admin User',
    role: 'admin',
    description: 'Main administrator account'
  },
  {
    email: 'user@example.com',
    password: '12345',
    full_name: 'Standard User',
    role: 'user',
    description: 'Regular user account',
    username: '99120105'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
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

export const useAuth = () => useContext(AuthContext);
