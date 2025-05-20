
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Default values to prevent errors when environment variables are not set
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [envMissing, setEnvMissing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Check if environment variables are set
  useEffect(() => {
    if (import.meta.env.VITE_SUPABASE_URL === undefined || 
        import.meta.env.VITE_SUPABASE_ANON_KEY === undefined) {
      setEnvMissing(true);
      toast({
        variant: "destructive",
        title: "Supabase configuration missing",
        description: "Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
      });
    }
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent login attempt if environment variables are missing
    if (envMissing) {
      toast({
        variant: "destructive",
        title: "Cannot proceed",
        description: "Please set the required Supabase environment variables first.",
      });
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
        return;
      }

      // Check for admin role
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (userError) {
        toast({
          variant: "destructive",
          title: "Error fetching user profile",
          description: userError.message,
        });
        return;
      }

      // Redirect to admin dashboard or regular dashboard based on role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

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
          
          {envMissing && (
            <CardContent className="pt-0">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Missing</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Please set the following environment variables:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><code>VITE_SUPABASE_URL</code> - Your Supabase project URL</li>
                    <li><code>VITE_SUPABASE_ANON_KEY</code> - Your Supabase project anonymous key</li>
                  </ul>
                  <p className="mt-2">These can be found in your Supabase project settings under API settings.</p>
                </AlertDescription>
              </Alert>
            </CardContent>
          )}
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={envMissing}
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
                  disabled={envMissing}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                type="submit" 
                disabled={loading || envMissing}
              >
                {envMissing ? "Configuration Required" : (loading ? "Logging in..." : "Login")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
