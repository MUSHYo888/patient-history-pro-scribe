import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthProviderProps } from './types';
import AuthContext from './AuthContext';
import { signIn, signOut, updateProfile } from './authActions';
import { initializeAuthState } from './authStateInitializer';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  
  // Sign in handler
  const handleSignIn = async (emailOrUsername: string, password: string) => {
    return signIn(emailOrUsername, password, setLoading);
  };

  // Sign out handler
  const handleSignOut = async () => {
    return signOut(
      setLoading,
      setUser,
      setProfile,
      setSession,
      setIsAdmin,
      navigate,
      toast
    );
  };

  // Update profile handler
  const handleUpdateProfile = async (fullName: string, description: string) => {
    if (!user) return;
    return updateProfile(user.id, fullName, description, setProfile, profile, toast);
  };

  // Initialize auth state using a custom hook
  useEffect(() => {
    const navigate = useNavigate();
    initializeAuthState({
      setUser,
      setProfile,
      setSession,
      setIsAdmin,
      setLoading,
      navigate
    });
  }, [navigate]);

  const value = {
    user,
    profile,
    session,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAdmin,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
