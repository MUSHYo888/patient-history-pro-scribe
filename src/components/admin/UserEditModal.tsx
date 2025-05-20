
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, updateUser } from '@/utils/user';
import { Pen, UserPlus } from 'lucide-react';

interface UserFormData {
  email: string;
  username: string;
  password: string;
  fullName: string;
  description: string;
  role: string;
}

interface UserEditModalProps {
  mode: 'create' | 'edit';
  user?: any;
  onSuccess?: () => void;
}

const UserEditModal = ({ mode, user, onSuccess }: UserEditModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    defaultValues: {
      email: user?.email || '',
      username: user?.username || '',
      password: '',
      fullName: user?.full_name || '',
      description: user?.description || '',
      role: user?.role || 'user',
    },
  });

  const handleSubmit = async (data: UserFormData) => {
    setLoading(true);

    try {
      if (mode === 'create') {
        await createUser(
          data.email, 
          data.password, 
          data.fullName, 
          data.role, 
          data.description, 
          data.username || undefined
        );

        toast({
          title: 'User created',
          description: `Successfully created user ${data.email || data.username}`,
        });
      } else {
        // Update existing user
        if (user?.id) {
          await updateUser(
            user.id, 
            data.password || null, 
            data.fullName, 
            data.role, 
            data.description,
            data.username || null,
            data.email !== user.email ? data.email : null
          );

          toast({
            title: 'User updated',
            description: `Successfully updated user ${data.email || data.username}`,
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="user@example.com" 
                      {...field} 
                      disabled={mode === 'edit' && field.value !== ''} 
                    />
                  </FormControl>
                  {mode === 'edit' && field.value !== '' && (
                    <FormDescription>
                      Email address cannot be changed directly
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>
                    Alternative login identifier
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{mode === 'create' ? 'Password' : 'New Password'}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={mode === 'edit' ? "Leave blank to keep current" : "Password"} 
                      {...field} 
                      required={mode === 'create'} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A short description about this user" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Processing...' : (mode === 'create' ? 'Create' : 'Save Changes')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
