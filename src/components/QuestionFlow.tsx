
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

interface QuestionFlowProps {
  complaintId: string;
}

const QuestionFlow = ({ complaintId }: QuestionFlowProps) => {
  const navigate = useNavigate();
  const { currentPatient, saveResponses, setChiefComplaint, setSummary } = usePatient();
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState(0);

  const complaintData = questionDatabase[complaintId];

  useEffect(() => {
    if (complaintData) {
      setCurrentQuestionId(complaintData.initialQuestion);
      setChiefComplaint(complaintData.name);
    }
  }, [complaintData, setChiefComplaint]);

  useEffect(() => {
    if (currentPatient?.responses) {
      setResponses(currentPatient.responses);
    }
  }, [currentPatient]);

  const handleAnswer = (answer: any) => {
    if (!currentQuestionId) return;

    const newResponses = { ...responses, [currentQuestionId]: answer };
    setResponses(newResponses);
    
    // Save responses after each answer
    saveResponses(newResponses);
    
    // Find next question
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

  if (!complaintData || !currentQuestionId) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = complaintData.questions[currentQuestionId];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{complaintData.name}</CardTitle>
        <CardDescription>
          Question {Object.keys(responses).length + 1} of {Object.keys(complaintData.questions).length}
        </CardDescription>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium">{currentQuestion.text}</Label>
            
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
                  defaultValue={responses[currentQuestionId] || ''}
                  onChange={(e) => setResponses({ ...responses, [currentQuestionId]: e.target.value })}
                />
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleAnswer(responses[currentQuestionId] || '')}
                >
                  Next
                </Button>
              </div>
            )}
            
            {currentQuestion.type === 'number' && (
              <div className="pt-2">
                <Input 
                  type="number"
                  defaultValue={responses[currentQuestionId] || ''}
                  onChange={(e) => setResponses({ ...responses, [currentQuestionId]: e.target.value })}
                />
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleAnswer(parseInt(responses[currentQuestionId] || '0'))}
                >
                  Next
                </Button>
              </div>
            )}
            
            {currentQuestion.type === 'date' && (
              <div className="pt-2">
                <Input 
                  type="date"
                  defaultValue={responses[currentQuestionId] || ''}
                  onChange={(e) => setResponses({ ...responses, [currentQuestionId]: e.target.value })}
                />
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleAnswer(responses[currentQuestionId] || '')}
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
