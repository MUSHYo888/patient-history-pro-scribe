
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

// Default values to prevent errors when environment variables are not set
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface UserPatientCount {
  user_id: string;
  user_email: string;
  count: number;
}

export interface ComplaintCount {
  complaint: string;
  count: number;
}

export const useAnalyticsData = () => {
  const { toast } = useToast();
  const [userPatientCounts, setUserPatientCounts] = useState<UserPatientCount[]>([]);
  const [commonComplaints, setCommonComplaints] = useState<ComplaintCount[]>([]);
  const [totalSummaries, setTotalSummaries] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // For demo purposes, we'll generate mock data
      // In a production environment, these would be actual Supabase queries
      
      // Mock user patient counts
      const mockUserCounts = [
        { user_id: '1', user_email: 'doctor1@example.com', count: 15 },
        { user_id: '2', user_email: 'doctor2@example.com', count: 8 },
        { user_id: '3', user_email: 'nurse1@example.com', count: 12 },
        { user_id: '4', user_email: 'specialist@example.com', count: 5 }
      ];
      setUserPatientCounts(mockUserCounts);
      
      // Mock common complaints
      const mockComplaints = [
        { complaint: 'Chest Pain', count: 12 },
        { complaint: 'Headache', count: 10 },
        { complaint: 'Abdominal Pain', count: 7 },
        { complaint: 'Shortness of Breath', count: 6 },
        { complaint: 'Back Pain', count: 5 }
      ];
      setCommonComplaints(mockComplaints);
      
      // Mock total summaries
      setTotalSummaries(45);

      // Example of an actual Supabase query (commented out)
      /*
      // Get patient counts per user
      const { data: patientCountData, error: patientCountError } = await supabase
        .from('patients')
        .select('created_by, count(*)', { count: 'exact' })
        .groupby('created_by');
        
      if (patientCountError) throw patientCountError;
      
      // Get profiles for user emails
      const userIds = patientCountData.map(item => item.created_by);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);
        
      if (profilesError) throw profilesError;
      
      // Combine the data
      const userCounts = patientCountData.map(item => {
        const profile = profilesData.find(p => p.id === item.created_by);
        return {
          user_id: item.created_by,
          user_email: profile?.email || 'Unknown User',
          count: item.count
        };
      });
      
      setUserPatientCounts(userCounts);
      */
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        variant: "destructive",
        title: "Failed to load analytics data",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    userPatientCounts,
    commonComplaints,
    totalSummaries,
    loading,
    refreshData: fetchAnalyticsData
  };
};
