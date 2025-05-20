
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '@/context/PatientContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Header from '@/components/Header';

const NewPatient = () => {
  const navigate = useNavigate();
  const { addPatient } = usePatient();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactInfo: '',
    dateOfVisit: new Date().toISOString().split('T')[0],
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.gender) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create new patient with unique ID
    const newPatient = {
      id: `patient_${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: parseInt(formData.age),
      gender: formData.gender,
      contactInfo: formData.contactInfo,
      dateOfVisit: formData.dateOfVisit,
    };
    
    // Add patient and navigate to history page
    addPatient(newPatient);
    navigate('/history');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <Card className="max-w-xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">New Patient</CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={handleGenderChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Information</Label>
                    <Input
                      id="contactInfo"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleChange}
                      placeholder="Phone or email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfVisit">Date of Visit *</Label>
                    <Input
                      id="dateOfVisit"
                      name="dateOfVisit"
                      type="date"
                      value={formData.dateOfVisit}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  Next: Chief Complaint
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPatient;
