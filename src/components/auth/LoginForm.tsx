
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from "lucide-react";
import { CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import LoginErrorAlert from './LoginErrorAlert';
import LoginCredentialsInfo from './LoginCredentialsInfo';
import { supabase, resetSupabaseClient } from '@/context/auth/supabaseClient';

interface LoginFormProps {
  onLogin: (emailOrUsername: string, password: string) => Promise<void>;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      // Clear any existing session data before attempting login
      await resetSupabaseClient();
      
      console.log('Attempting login with:', emailOrUsername);
      await onLogin(emailOrUsername, password);
      
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

  return (
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
        
        {loginError && <LoginErrorAlert error={loginError} />}
        
        <LoginCredentialsInfo />
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
  );
};

export default LoginForm;
