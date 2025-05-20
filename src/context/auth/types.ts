
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  signIn: (emailOrUsername: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  updateProfile: (fullName: string, description: string) => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const predefinedAccounts = [
  {
    email: 'muslimkaki@gmail.com',
    password: '12345',
    full_name: 'Admin User',
    role: 'admin',
    description: 'Main administrator account'
  },
  {
    email: 'user@example.com',
    password: '12345',
    full_name: 'Standard User',
    role: 'user',
    description: 'Regular user account',
    username: '99120105'
  }
];
