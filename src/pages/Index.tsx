
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { usePatient } from '@/context/PatientContext';
import PatientCard from '@/components/PatientCard';

const Index = () => {
  const { patients, removePatient } = usePatient();
  const recentPatients = patients.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient History Pro</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive clinical history-taking application designed for healthcare professionals 
                and medical students to efficiently conduct patient interviews.
              </p>
            </div>
            
            <div className="flex justify-center mb-12">
              <Link to="/new-patient">
                <Button size="lg" className="px-8 py-6 text-lg">
                  + New Patient
                </Button>
              </Link>
            </div>
            
            {recentPatients.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Patients</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentPatients.map((patient) => (
                    <PatientCard 
                      key={patient.id} 
                      patient={patient} 
                      onDelete={removePatient} 
                    />
                  ))}
                </div>
                
                {patients.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link to="/patients">
                      <Button variant="outline">View All Patients</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Structured Approach</h3>
                  <p className="text-gray-600">
                    Follows standardized clinical frameworks from Bates' Guide to Physical Examination
                    and Harrison's Principles of Internal Medicine.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Dynamic Questions</h3>
                  <p className="text-gray-600">
                    Flowchart-based system of follow-up clinical questions based on clinical
                    reasoning patterns.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Professional Summaries</h3>
                  <p className="text-gray-600">
                    Automatically compiles patient information into a clear, organized narrative
                    resembling a physician's professional history note.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
