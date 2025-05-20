
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
  
  // Check if responses contain any red flag answers
  const hasRedFlags = Object.keys(currentPatient.responses || {}).some(key => 
    key.startsWith('red_flag_') && currentPatient.responses?.[key] === 'Yes'
  );
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {hasRedFlags && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 mx-auto max-w-4xl">
              <div className="flex items-center">
                <div className="py-1">
                  <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Medical Alert</p>
                  <p className="text-sm">This patient's responses contain red flag symptoms that may require urgent attention.</p>
                </div>
              </div>
            </div>
          )}
          <div className="px-4 sm:px-0">
            <SummaryView />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Summary;
