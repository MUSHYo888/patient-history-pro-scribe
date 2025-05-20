
import React, { useEffect } from 'react';
import { usePatient } from '@/context/PatientContext';
import { generateSummary } from '@/utils/summaryGenerator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const SummaryView = () => {
  const { currentPatient, setSummary } = usePatient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentPatient) {
      navigate('/');
      return;
    }

    if (currentPatient && !currentPatient.summary) {
      const summary = generateSummary(currentPatient);
      setSummary(summary);
    }
  }, [currentPatient, setSummary, navigate]);

  if (!currentPatient) return null;

  const handleExportPDF = () => {
    alert('Export to PDF functionality would be implemented here');
    // In a real implementation, this would generate and download a PDF
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto print:shadow-none">
      <CardHeader>
        <CardTitle>Patient Summary</CardTitle>
        <CardDescription>
          {currentPatient.firstName} {currentPatient.lastName} - {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          {currentPatient.summary ? (
            currentPatient.summary.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index} className="text-2xl font-bold mt-4">{line.substring(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-bold mt-4">{line.substring(3)}</h2>;
              }
              if (line.startsWith('### WARNING:')) {
                return (
                  <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-red-800">{line.substring(4)}</h3>
                      </div>
                    </div>
                  </div>
                );
              }
              if (line.startsWith('### ')) {
                return <h3 key={index} className="text-lg font-bold mt-3">{line.substring(4)}</h3>;
              }
              
              // Style red flag information differently
              if (index > 0 && currentPatient.summary.split('\n')[index-1].includes('WARNING:')) {
                return <p key={index} className="my-2 text-red-600 font-medium">{line}</p>;
              }
              
              return line ? <p key={index} className="my-2">{line}</p> : <br key={index} />;
            })
          ) : (
            <p>Generating summary...</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between print:hidden">
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Home
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handlePrintSummary}>
            Print
          </Button>
          <Button onClick={handleExportPDF}>
            Export PDF
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SummaryView;
