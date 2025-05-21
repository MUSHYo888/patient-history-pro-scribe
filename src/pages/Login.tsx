
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import { useAuth } from '@/context/auth';
import { supabase, resetSupabaseClient } from '@/context/auth/supabaseClient';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, session, loading: authLoading, user } = useAuth();

  // Reset form and error state when component mounts or location changes
  useEffect(() => {
    setEmailOrUsername('');
    setPassword('');
    setLoginError(null);
    setLoading(false);
  }, [location.key]); // Reset when navigation occurs

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      // Clear any existing session data before attempting login
      await resetSupabaseClient();
      
      console.log('Attempting login with:', emailOrUsername);
      await signIn(emailOrUsername, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigation is handled by the auth state listener
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Failed to log in. Please check your credentials and try again.');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || 'Failed to log in. Please check your credentials and try again.',
      });
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-gray-500">Loading authentication...</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-blue-500 hover:text-blue-700 underline"
        >
          Stuck? Click to reload
        </button>
      </div>
    );
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
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername">Email or Username</Label>
                <Input
                  id="emailOrUsername"
                  placeholder="Email or Username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Error</AlertTitle>
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              
              <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Pre-defined accounts</AlertTitle>
                <AlertDescription className="text-xs mt-2">
                  <div className="mb-1"><strong>Admin:</strong> muslimkaki@gmail.com / 12345</div>
                  <div><strong>User:</strong> 99120105 / 12345</div>
                </AlertDescription>
              </Alert>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
