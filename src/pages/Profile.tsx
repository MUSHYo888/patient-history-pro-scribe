
import React from 'react';
import Header from '@/components/Header';
import UserProfile from '@/components/user/UserProfile';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto py-6">
          <UserProfile />
        </div>
      </main>
    </div>
  );
};

export default Profile;
