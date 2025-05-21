
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

      // Check if user is an admin by email or metadata
      const isAdmin = 
        data.session.user.email === 'muslimkaki@gmail.com' || 
        data.session.user.app_metadata?.role === 'admin' || 
        data.session.user.user_metadata?.role === 'admin';
      
      if (!isAdmin) {
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
      // Fetch users directly from auth.users using admin functions
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      // Format user data to match expected structure
      const formattedUsers = data?.users?.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'N/A',
        role: user.app_metadata?.role || 'user',
        created_at: user.created_at
      })) || [];
      
      setUsers(formattedUsers);
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
