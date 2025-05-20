
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePatient } from '@/context/PatientContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, UserCircle } from 'lucide-react';

const Header = () => {
  const { currentPatient } = usePatient();
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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
            
            {user && (
              <nav className="flex items-center space-x-4">
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
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Profile
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                
                <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-gray-200">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UserCircle className="inline h-4 w-4 mr-1" />
                    {profile?.full_name || user.email}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
