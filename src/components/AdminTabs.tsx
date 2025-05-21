
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import UsersTable from '@/components/UsersTable';
import UserManager from '@/components/admin/UserManager';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

interface AdminTabsProps {
  users: any[];
  loading: boolean;
  onUserUpdate: () => void;
}

const AdminTabs = ({ users, loading, onUserUpdate }: AdminTabsProps) => {
  return (
    <Tabs defaultValue="users">
      <TabsList className="mb-4">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="user-manager">User Management</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="patients">Patient Records</TabsTrigger>
        <TabsTrigger value="reports">PDF Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users" className="bg-white p-6 rounded-md border">
        <h2 className="text-xl font-semibold mb-4">User Summary</h2>
        <UsersTable users={users} loading={loading} onUserUpdate={onUserUpdate} />
      </TabsContent>
      
      <TabsContent value="user-manager" className="bg-white p-6 rounded-md border">
        <UserManager />
      </TabsContent>
      
      <TabsContent value="analytics" className="bg-white p-6 rounded-md border">
        <h2 className="text-xl font-semibold mb-4">Admin Analytics</h2>
        <AdminAnalytics />
      </TabsContent>
      
      <TabsContent value="patients" className="bg-white p-6 rounded-md border">
        <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
        <p>Patient management interface will be implemented here.</p>
      </TabsContent>
      
      <TabsContent value="reports" className="bg-white p-6 rounded-md border">
        <h2 className="text-xl font-semibold mb-4">PDF Reports</h2>
        <p>PDF reports management interface will be implemented here.</p>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
