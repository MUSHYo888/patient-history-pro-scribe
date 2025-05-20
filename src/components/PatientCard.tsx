
import { Patient } from '@/context/PatientContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PatientCardProps {
  patient: Patient;
  onDelete: (id: string) => void;
}

const PatientCard = ({ patient, onDelete }: PatientCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{patient.firstName} {patient.lastName}</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            ID: {patient.id.slice(0, 8)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-1 text-sm">
          <div className="text-muted-foreground">Age:</div>
          <div>{patient.age}</div>
          <div className="text-muted-foreground">Gender:</div>
          <div>{patient.gender}</div>
          <div className="text-muted-foreground">Visit Date:</div>
          <div>{patient.dateOfVisit}</div>
          {patient.chiefComplaint && (
            <>
              <div className="text-muted-foreground">Chief Complaint:</div>
              <div>{patient.chiefComplaint}</div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {patient.summary ? (
          <Link to={`/summary/${patient.id}`}>
            <Button variant="outline" size="sm">View Summary</Button>
          </Link>
        ) : (
          <Link to={`/history/${patient.id}`}>
            <Button variant="outline" size="sm">
              {patient.chiefComplaint ? 'Continue History' : 'Start History'}
            </Button>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(patient.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
