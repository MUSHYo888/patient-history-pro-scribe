
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SummaryView from '@/components/SummaryView';
import { usePatient } from '@/context/PatientContext';
import { Button } from '@/components/ui/button';

const Summary = () => {
  const navigate = useNavigate();
  const { currentPatient } = usePatient();
  
  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">No patient selected</h2>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <SummaryView />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Summary;
