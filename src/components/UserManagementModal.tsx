
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import UserFormFields from './user/UserFormFields';
import { createUser, updateUser, UserData } from '@/utils/userManagementUtils';

interface UserManagementModalProps {
  mode: 'create' | 'edit';
  user?: UserData;
  onSuccess?: () => void;
}

const UserManagementModal = ({ mode, user, onSuccess }: UserManagementModalProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [role, setRole] = useState(user?.role || 'user');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        await createUser(email, password, fullName, role);

        toast({
          title: 'User created',
          description: `Successfully created user ${email}`,
        });
      } else {
        // Update existing user
        if (user?.id) {
          await updateUser(user.id, password || null, fullName, role);

          toast({
            title: 'User updated',
            description: `Successfully updated user ${email}`,
          });
        }
      }

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `Failed to ${mode === 'create' ? 'create' : 'update'} user`,
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={mode === 'create' ? 'default' : 'outline'} size={mode === 'create' ? 'default' : 'sm'}>
          {mode === 'create' ? 'Create New User' : 'Edit'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New User' : 'Edit User'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Add a new user to the system. They will be able to log in with these credentials.'
              : 'Update user details and permissions.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <UserFormFields
            email={email}
            setEmail={setEmail}
            fullName={fullName}
            setFullName={setFullName}
            password={password}
            setPassword={setPassword}
            role={role}
            setRole={setRole}
            mode={mode}
          />
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : (mode === 'create' ? 'Create' : 'Save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementModal;
