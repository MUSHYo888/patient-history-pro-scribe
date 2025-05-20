
import React from 'react';
import { Link } from 'react-router-dom';
import { usePatient } from '@/context/PatientContext';

const Header = () => {
  const { currentPatient } = usePatient();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-primary font-bold text-xl">
              Patient History Pro
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {currentPatient && (
              <div className="text-sm text-muted-foreground">
                Current Patient: {currentPatient.firstName} {currentPatient.lastName}
              </div>
            )}
            <nav className="flex space-x-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                to="/patients" 
                className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Patients
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
