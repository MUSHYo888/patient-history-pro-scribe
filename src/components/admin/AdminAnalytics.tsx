
import React from 'react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCards from './analytics/StatCards';
import ComplaintsChart from './analytics/ComplaintsChart';
import UserPatientTable from './analytics/UserPatientTable';

const AdminAnalytics = () => {
  const { 
    userPatientCounts, 
    commonComplaints, 
    totalSummaries, 
    loading 
  } = useAnalyticsData();

  const getTotalPatientCount = () => {
    return userPatientCounts.reduce((sum, user) => sum + user.count, 0);
  };

  return (
    <div className="space-y-6">
      <StatCards 
        userCount={getTotalPatientCount()}
        totalSummaries={totalSummaries}
        complaintTypesCount={commonComplaints.length}
        loading={loading}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Common Chief Complaints</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ComplaintsChart 
            commonComplaints={commonComplaints}
            loading={loading}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Patient Records Per Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <UserPatientTable 
            userPatientCounts={userPatientCounts}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
