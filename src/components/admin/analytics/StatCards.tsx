
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardsProps {
  userCount: number;
  totalSummaries: number;
  complaintTypesCount: number;
  loading: boolean;
}

const StatCards = ({ userCount, totalSummaries, complaintTypesCount, loading }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Patient Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '...' : userCount}
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
            {loading ? '...' : complaintTypesCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Types of complaints recorded
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
