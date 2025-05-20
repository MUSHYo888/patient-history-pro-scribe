
import React, { useState, useEffect } from 'react';
import { usePatient } from '@/context/PatientContext';
import { questionDatabase } from '@/data/questionDatabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface QuestionFlowProps {
  complaintId: string;
}

const QuestionFlow = ({ complaintId }: QuestionFlowProps) => {
  const navigate = useNavigate();
  const { currentPatient, saveResponses, setChiefComplaint } = usePatient();
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState(0);
  const [textInput, setTextInput] = useState<string>('');
  const [numberInput, setNumberInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [loadedInitialData, setLoadedInitialData] = useState(false);

  const complaintData = questionDatabase[complaintId];

  // Set initial question and chief complaint only once
  useEffect(() => {
    if (complaintData && !loadedInitialData) {
      setCurrentQuestionId(complaintData.initialQuestion);
      setChiefComplaint(complaintData.name);
      setLoadedInitialData(true);
    }
  }, [complaintData, setChiefComplaint, loadedInitialData]);

  // Load responses from patient context and set initial inputs only when needed
  useEffect(() => {
    if (currentPatient?.responses && !loadedInitialData) {
      setResponses(currentPatient.responses);
      setLoadedInitialData(true);
    }
  }, [currentPatient, loadedInitialData]);

  // Update input states when current question changes
  useEffect(() => {
    if (currentQuestionId && currentPatient?.responses) {
      const savedResponse = currentPatient.responses[currentQuestionId];
      if (savedResponse) {
        if (typeof savedResponse === 'string') {
          setTextInput(savedResponse);
          setDateInput(savedResponse);
        } else if (typeof savedResponse === 'number') {
          setNumberInput(String(savedResponse));
        }
      } else {
        // Clear inputs when there's no saved response for this question
        setTextInput('');
        setNumberInput('');
        setDateInput('');
      }
    }
  }, [currentQuestionId, currentPatient?.responses]);

  const handleAnswer = (answer: any) => {
    if (!currentQuestionId) return;

    // Update local state
    const newResponses = { ...responses, [currentQuestionId]: answer };
    setResponses(newResponses);
    
    // Save responses to context
    saveResponses(newResponses);
    
    // Get the next question
    const question = complaintData?.questions[currentQuestionId];
    if (!question) return;
    
    const nextQuestionIds = 
      (question.nextQuestions?.[answer]) || 
      (question.nextQuestions?.default) || 
      [];
    
    if (nextQuestionIds.length > 0) {
      setCurrentQuestionId(nextQuestionIds[0]);
      setProgress((prev) => Math.min(prev + 10, 90));
    } else {
      // No more questions, complete flow
      setProgress(100);
      navigate(`/summary`);
    }
  };

  // Handle text input submission
  const handleTextSubmit = () => {
    handleAnswer(textInput);
  };

  // Handle number input submission
  const handleNumberSubmit = () => {
    const numVal = parseInt(numberInput);
    handleAnswer(isNaN(numVal) ? 0 : numVal);
  };

  // Handle date input submission
  const handleDateSubmit = () => {
    handleAnswer(dateInput);
  };

  if (!complaintData || !currentQuestionId) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = complaintData.questions[currentQuestionId];
  const totalQuestions = Object.keys(complaintData.questions).length;
  // Estimate progress considering red flag questions might be skipped
  const adjustedProgress = Math.min(
    (Object.keys(responses).length / (totalQuestions * 0.7)) * 100,
    100
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{complaintData.name}</CardTitle>
        <CardDescription>
          Question {Object.keys(responses).length + 1} of approximately {Math.ceil(totalQuestions * 0.7)}
          <span className="text-xs text-muted-foreground ml-2">(some questions may be skipped based on your answers)</span>
        </CardDescription>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${adjustedProgress}%` }}
          ></div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {currentQuestion.isRedFlag && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Medical Question</AlertTitle>
              <AlertDescription>
                This question helps identify potentially serious conditions.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label className={`text-lg font-medium ${currentQuestion.isRedFlag ? 'text-destructive' : ''}`}>
              {currentQuestion.text}
            </Label>
            
            {currentQuestion.type === 'yes_no' && (
              <RadioGroup defaultValue={responses[currentQuestionId] || ''} className="flex space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="yes" onClick={() => handleAnswer('Yes')} />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="no" onClick={() => handleAnswer('No')} />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            )}
            
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <RadioGroup defaultValue={responses[currentQuestionId] || ''} className="space-y-2 pt-2">
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option} 
                      id={option} 
                      onClick={() => handleAnswer(option)} 
                    />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentQuestion.type === 'text' && (
              <div className="pt-2">
                <Input 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <Button 
                  className="w-full mt-4" 
                  onClick={handleTextSubmit}
                >
                  Next
                </Button>
              </div>
            )}
            
            {currentQuestion.type === 'number' && (
              <div className="pt-2">
                <Input 
                  type="number"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                />
                <Button 
                  className="w-full mt-4" 
                  onClick={handleNumberSubmit}
                >
                  Next
                </Button>
              </div>
            )}
            
            {currentQuestion.type === 'date' && (
              <div className="pt-2">
                <Input 
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                />
                <Button 
                  className="w-full mt-4" 
                  onClick={handleDateSubmit}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Answer all questions to the best of your knowledge
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionFlow;
