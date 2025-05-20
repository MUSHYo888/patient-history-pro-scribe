
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
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
              if (line.startsWith('### ')) {
                return <h3 key={index} className="text-lg font-bold mt-3">{line.substring(4)}</h3>;
              }
              return line ? <p key={index} className="my-2">{line}</p> : <br key={index} />;
            })
          ) : (
            <p>Generating summary...</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Home
        </Button>
        <Button onClick={handleExportPDF}>
          Export PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryView;
