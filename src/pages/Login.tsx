import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth';
import { resetSupabaseClient } from '@/context/auth/supabaseClient';
import LoadingIndicator from '@/components/auth/LoadingIndicator';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, session, loading: authLoading, user } = useAuth();

  // Reset form and error state when component mounts or location changes
  useEffect(() => {
    // Reset when navigation occurs
  }, [location.key]);

  // Comprehensive cleanup on login page mount
  useEffect(() => {
    const cleanupSession = async () => {
      console.log('Running session cleanup on login page mount');
      await resetSupabaseClient();
    };
    
    cleanupSession();
    
    // Set a shorter timeout to detect stuck loading states
    const loadingTimer = setTimeout(() => {
      if (authLoading) {
        console.log('Auth loading state is taking too long - possible stuck state');
        window.location.reload(); // Force page reload if loading is taking too long
      }
    }, 3000); // 3 seconds timeout (reduced from 5)
    
    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (session && user) {
      console.log('Login - User already logged in, redirecting');
      // Check if the user has admin role
      const isAdmin = user.app_metadata?.role === 'admin' || 
                     user.user_metadata?.role === 'admin' ||
                     (user.email === 'muslimkaki@gmail.com');
      
      // Navigate to the appropriate page
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    }
  }, [session, user, navigate]);

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access Patient History Pro
            </CardDescription>
          </CardHeader>
          
          <LoginForm onLogin={signIn} />
        </Card>
      </div>
    </div>
  );
};

export default Login;
