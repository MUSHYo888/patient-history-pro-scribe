
import React from 'react';

interface UserPatientCount {
  user_id: string;
  user_email: string;
  count: number;
}

interface UserPatientTableProps {
  userPatientCounts: UserPatientCount[];
  loading: boolean;
}

const UserPatientTable = ({ userPatientCounts, loading }: UserPatientTableProps) => {
  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
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
  );
};

export default UserPatientTable;
