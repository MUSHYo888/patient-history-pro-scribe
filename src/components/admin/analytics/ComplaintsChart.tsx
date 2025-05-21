
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ComplaintCount {
  complaint: string;
  count: number;
}

interface ComplaintsChartProps {
  commonComplaints: ComplaintCount[];
  loading: boolean;
}

const ComplaintsChart = ({ commonComplaints, loading }: ComplaintsChartProps) => {
  const chartConfig = {
    complaints: {
      label: "Complaint Distribution",
      theme: {
        light: "#9b87f5",
        dark: "#7E69AB"
      }
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p>Loading chart data...</p>
      </div>
    );
  }

  return (
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
  );
};

export default ComplaintsChart;
