
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '@/context/PatientContext';
import { commonComplaints, questionDatabase } from '@/data/questionDatabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import QuestionFlow from '@/components/QuestionFlow';

const History = () => {
  const navigate = useNavigate();
  const { currentPatient } = usePatient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComplaints, setFilteredComplaints] = useState(commonComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  
  useEffect(() => {
    if (!currentPatient) {
      navigate('/');
    }
    
    // If they already have a complaint selected, show the question flow
    if (currentPatient?.chiefComplaint) {
      const complaintId = Object.keys(questionDatabase).find(
        key => questionDatabase[key].name === currentPatient.chiefComplaint
      );
      if (complaintId) {
        setSelectedComplaint(complaintId);
      }
    }
  }, [currentPatient, navigate]);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = commonComplaints.filter(complaint => 
        complaint.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredComplaints(filtered);
    } else {
      setFilteredComplaints(commonComplaints);
    }
  }, [searchTerm]);
  
  const handleComplaintSelect = (complaint: string) => {
    const complaintId = Object.keys(questionDatabase).find(
      key => questionDatabase[key].name === complaint
    );
    
    if (complaintId) {
      setSelectedComplaint(complaintId);
    } else {
      // For demo purposes, default to chest pain if complaint not in database
      setSelectedComplaint('chest-pain');
    }
  };
  
  if (!currentPatient) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            {!selectedComplaint ? (
              <Card className="max-w-xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">Chief Complaint</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Input
                        placeholder="Search for a chief complaint..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                      />
                      
                      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                        {filteredComplaints.map((complaint) => (
                          <Button
                            key={complaint}
                            variant="outline"
                            className="justify-start text-left h-auto py-3"
                            onClick={() => handleComplaintSelect(complaint)}
                          >
                            {complaint}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {filteredComplaints.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No matching complaints found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <QuestionFlow complaintId={selectedComplaint} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
