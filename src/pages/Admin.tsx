
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FilePdf, UserPlus, Database, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAdminAuth();
    fetchUsers();
  }, []);

  const checkAdminAuth = async () => {
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
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: "Please try again later",
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patient Records</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PDF Reports</CardTitle>
                <FilePdf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Add User</CardTitle>
                <UserPlus className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <Button className="w-full mt-2" size="sm">
                  Create New User
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="users">
            <TabsList className="mb-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="patients">Patient Records</TabsTrigger>
              <TabsTrigger value="reports">PDF Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="bg-white p-6 rounded-md border">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Role</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user: any) => (
                          <tr key={user.id} className="border-b">
                            <td className="py-2">{user.full_name || 'N/A'}</td>
                            <td className="py-2">{user.email || 'N/A'}</td>
                            <td className="py-2">{user.role || 'user'}</td>
                            <td className="py-2">
                              <Button variant="outline" size="sm">Edit</Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="patients" className="bg-white p-6 rounded-md border">
              <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
              <p>Patient management interface will be implemented here.</p>
            </TabsContent>
            
            <TabsContent value="reports" className="bg-white p-6 rounded-md border">
              <h2 className="text-xl font-semibold mb-4">PDF Reports</h2>
              <p>PDF reports management interface will be implemented here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
