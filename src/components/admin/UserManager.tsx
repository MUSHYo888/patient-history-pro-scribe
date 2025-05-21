
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser } from '@/utils/user';
import UserEditModal from './UserEditModal';
import { Pen, Trash2 } from 'lucide-react';
import { supabase } from '@/context/auth/supabaseClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Use auth.admin to list users
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) throw error;
        
        // Format user data to match expected structure
        const formattedUsers = data?.users?.map(user => ({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          role: user.app_metadata?.role || 'user',
          description: user.user_metadata?.description || '',
          username: user.user_metadata?.username || '',
          created_at: user.created_at
        })) || [];
        
        setUsers(formattedUsers);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          variant: "destructive",
          title: "Failed to load users",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  const handleUserUpdate = () => {
    // Trigger a refresh of the user list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      await deleteUser(userId);
      
      toast({
        title: "User deleted",
        description: `User ${userEmail} has been deleted successfully`,
      });
      
      // Refresh the user list
      handleUserUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete user",
        description: error.message,
      });
    }
  };

  if (loading) {
    return <div className="w-full py-8 text-center">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <UserEditModal mode="create" onSuccess={handleUserUpdate} />
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email/Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs truncate max-w-[80px]">{user.id.substring(0, 8)}...</TableCell>
                  <TableCell>{user.full_name || 'N/A'}</TableCell>
                  <TableCell>
                    {user.email}
                    {user.username && (
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        Username: {user.username}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{user.role || 'user'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {user.description || 'No description'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <UserEditModal mode="edit" user={user} onSuccess={handleUserUpdate} />
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the user account for {user.email || user.username}. 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id, user.email || user.username)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManager;
