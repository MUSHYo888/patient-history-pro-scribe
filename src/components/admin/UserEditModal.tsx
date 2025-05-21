
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Pen, UserPlus } from 'lucide-react';
import UserForm from './UserForm';

interface UserEditModalProps {
  mode: 'create' | 'edit';
  user?: any;
  onSuccess?: () => void;
}

const UserEditModal = ({ mode, user, onSuccess }: UserEditModalProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Pen className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New User' : 'Edit User'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Add a new user to the system'
              : 'Update user details and permissions'}
          </DialogDescription>
        </DialogHeader>
        
        <UserForm 
          mode={mode} 
          user={user} 
          onSuccess={onSuccess}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
