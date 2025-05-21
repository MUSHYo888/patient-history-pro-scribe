
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

// Default values to prevent errors when environment variables are not set
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface UserPatientCount {
  user_id: string;
  user_email: string;
  count: number;
}

interface ComplaintCount {
  complaint: string;
  count: number;
}

const AdminAnalytics = () => {
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

  const chartConfig = {
    complaints: {
      label: "Complaint Distribution",
      theme: {
        light: "#9b87f5",
        dark: "#7E69AB"
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Patient Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : userPatientCounts.reduce((sum, user) => sum + user.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all healthcare providers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total PDF Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : totalSummaries}
            </div>
            <p className="text-xs text-muted-foreground">
              Generated for patient histories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Chief Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : commonComplaints.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Types of complaints recorded
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Common Chief Complaints</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <p>Loading chart data...</p>
            </div>
          ) : (
            <ChartContainer className="h-80" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={commonComplaints}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="complaint" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60} 
                  />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" name="Cases" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Patient Records Per Provider</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading user data...</p>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Provider</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Patient Count</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {userPatientCounts.map((user) => (
                    <tr key={user.user_id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{user.user_email}</td>
                      <td className="p-4 align-middle">{user.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
