
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient History Pro</h1>
          <p className="text-xl text-gray-600">
            Welcome to your comprehensive clinical history-taking application
          </p>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500 mb-8">
            Designed for healthcare professionals and medical students to efficiently conduct
            patient interviews and produce standardized clinical notes.
          </p>
          
          <Link to="/login">
            <Button size="lg" className="w-full py-6">
              Login to Continue
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} Patient History Pro. All rights reserved.
      </div>
    </div>
  );
};

export default Welcome;
