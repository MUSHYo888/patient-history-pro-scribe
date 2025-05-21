
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardCards from '@/components/AdminDashboardCards';
import AdminTabs from '@/components/AdminTabs';
import { supabase } from '@/context/auth/supabaseClient';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchUsers();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please login to access the admin dashboard",
        });
        navigate('/login');
        return;
      }

      // Check if user is an admin
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (userError || userData?.role !== 'admin') {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "You don't have permission to access this page",
        });
        navigate('/');
        return;
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error.message || "Please try logging in again",
      });
      navigate('/login');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: error.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <AdminDashboardCards 
            userCount={users.length} 
            onCreateUserSuccess={fetchUsers} 
          />
          
          <AdminTabs 
            users={users} 
            loading={loading} 
            onUserUpdate={fetchUsers} 
          />
        </div>
      </main>
    </div>
  );
};

export default Admin;
