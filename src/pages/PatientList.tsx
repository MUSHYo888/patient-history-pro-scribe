
import React from 'react';
import { usePatient } from '@/context/PatientContext';
import Header from '@/components/Header';
import PatientCard from '@/components/PatientCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PatientList = () => {
  const { patients, removePatient } = usePatient();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Patient Records</h1>
              <Link to="/new-patient">
                <Button>+ New Patient</Button>
              </Link>
            </div>
            
            {patients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                  <PatientCard 
                    key={patient.id} 
                    patient={patient} 
                    onDelete={removePatient} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-500 mb-4">No patient records found</h3>
                <Link to="/new-patient">
                  <Button>Add Your First Patient</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientList;
