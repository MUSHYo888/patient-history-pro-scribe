
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, UserPlus, Database } from 'lucide-react';
import UserManagementModal from '@/components/UserManagementModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/context/auth/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

interface AdminDashboardCardsProps {
  userCount: number;
  onCreateUserSuccess: () => void;
}

const AdminDashboardCards = ({ userCount, onCreateUserSuccess }: AdminDashboardCardsProps) => {
  const { toast } = useToast();

  const { data: patientCount = 0, isLoading: patientsLoading } = useQuery({
    queryKey: ['patientCount'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Patient count error:', error);
          toast({
            variant: "destructive",
            title: "Failed to load patient count",
            description: error.message
          });
          return 0;
        }
        return count || 0;
      } catch (error: any) {
        console.error('Error fetching patient count:', error);
        return 0;
      }
    },
    retry: 1,
    staleTime: 60000, // 1 minute
  });

  const { data: pdfCount = 0, isLoading: pdfsLoading } = useQuery({
    queryKey: ['pdfCount'],
    queryFn: async () => {
      try {
        // Get PDF count from summaries table
        const { count, error } = await supabase
          .from('summaries')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('PDF count error:', error);
          toast({
            variant: "destructive",
            title: "Failed to load PDF count",
            description: error.message
          });
          return 0;
        }
        return count || 0;
      } catch (error: any) {
        console.error('Error fetching PDF count:', error);
        return 0;
      }
    },
    retry: 1,
    staleTime: 60000, // 1 minute
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userCount || 0}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Patient Records</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {patientsLoading ? "Loading..." : patientCount}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">PDF Reports</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {pdfsLoading ? "Loading..." : pdfCount}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Add User</CardTitle>
          <UserPlus className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <UserManagementModal mode="create" onSuccess={onCreateUserSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardCards;
