
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { createUser, updateUser } from '@/utils/user';

interface UserFormData {
  email: string;
  username: string;
  password: string;
  fullName: string;
  description: string;
  role: string;
}

interface UseUserFormProps {
  mode: 'create' | 'edit';
  user?: any;
  onSuccess?: () => void;
  onClose: () => void;
}

export const useUserForm = ({ mode, user, onSuccess, onClose }: UseUserFormProps) => {
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
      onClose();
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

  return {
    form,
    loading,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
