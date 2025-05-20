
export interface Question {
  id: string;
  text: string;
  type: 'yes_no' | 'multiple_choice' | 'text' | 'date' | 'number';
  options?: string[];
  nextQuestions?: Record<string, string[]>;
}

export interface ComplaintQuestions {
  id: string;
  name: string;
  initialQuestion: string;
  questions: Record<string, Question>;
}

export const commonComplaints = [
  'Chest Pain',
  'Shortness of Breath',
  'Headache',
  'Abdominal Pain',
  'Fever',
  'Back Pain',
  'Joint Pain',
  'Dizziness',
  'Nausea/Vomiting',
  'Fatigue',
  'Cough',
  'Rash',
  'Diarrhea',
  'Depression',
  'Anxiety',
];

// This is a simplified version. In a real app, this would be much more extensive
export const questionDatabase: Record<string, ComplaintQuestions> = {
  'chest-pain': {
    id: 'chest-pain',
    name: 'Chest Pain',
    initialQuestion: 'onset',
    questions: {
      onset: {
        id: 'onset',
        text: 'When did the chest pain start?',
        type: 'date',
        nextQuestions: {
          default: ['character'],
        },
      },
      character: {
        id: 'character',
        text: 'How would you describe the pain?',
        type: 'multiple_choice',
        options: ['Sharp', 'Dull', 'Crushing', 'Burning', 'Aching', 'Stabbing'],
        nextQuestions: {
          default: ['location'],
        },
      },
      location: {
        id: 'location',
        text: 'Where is the pain located?',
        type: 'multiple_choice',
        options: ['Center of chest', 'Left side of chest', 'Right side of chest', 'Upper chest', 'Lower chest'],
        nextQuestions: {
          default: ['radiation'],
        },
      },
      radiation: {
        id: 'radiation',
        text: 'Does the pain radiate to other areas?',
        type: 'multiple_choice',
        options: ['No', 'Left arm', 'Right arm', 'Jaw', 'Back', 'Abdomen'],
        nextQuestions: {
          default: ['severity'],
        },
      },
      severity: {
        id: 'severity',
        text: 'On a scale of 1-10, how severe is the pain?',
        type: 'number',
        nextQuestions: {
          default: ['exacerbating'],
        },
      },
      exacerbating: {
        id: 'exacerbating',
        text: 'What makes the pain worse?',
        type: 'multiple_choice',
        options: ['Physical exertion', 'Deep breathing', 'Lying flat', 'Emotional stress', 'Nothing specific'],
        nextQuestions: {
          default: ['alleviating'],
        },
      },
      alleviating: {
        id: 'alleviating',
        text: 'What makes the pain better?',
        type: 'multiple_choice',
        options: ['Rest', 'Sitting up', 'Antacids', 'Pain medication', 'Nothing helps'],
        nextQuestions: {
          default: ['associated'],
        },
      },
      associated: {
        id: 'associated',
        text: 'Are there any associated symptoms?',
        type: 'multiple_choice',
        options: ['Shortness of breath', 'Sweating', 'Nausea/vomiting', 'Dizziness/lightheadedness', 'None'],
        nextQuestions: {
          default: [],
        },
      },
    },
  },
  'headache': {
    id: 'headache',
    name: 'Headache',
    initialQuestion: 'onset',
    questions: {
      onset: {
        id: 'onset',
        text: 'When did the headache start?',
        type: 'date',
        nextQuestions: {
          default: ['frequency'],
        },
      },
      frequency: {
        id: 'frequency',
        text: 'How often do you experience these headaches?',
        type: 'multiple_choice',
        options: ['First time', 'Daily', 'Weekly', 'Monthly', 'Occasionally'],
        nextQuestions: {
          default: ['character'],
        },
      },
      character: {
        id: 'character',
        text: 'How would you describe the pain?',
        type: 'multiple_choice',
        options: ['Throbbing', 'Dull', 'Sharp', 'Pressure', 'Burning'],
        nextQuestions: {
          default: ['location'],
        },
      },
      location: {
        id: 'location',
        text: 'Where is the headache located?',
        type: 'multiple_choice',
        options: ['Entire head', 'Front of head', 'Back of head', 'One side only', 'Behind the eyes'],
        nextQuestions: {
          default: ['severity'],
        },
      },
      severity: {
        id: 'severity',
        text: 'On a scale of 1-10, how severe is the headache?',
        type: 'number',
        nextQuestions: {
          default: ['aura'],
        },
      },
      aura: {
        id: 'aura',
        text: 'Do you experience any warning signs before the headache starts?',
        type: 'multiple_choice',
        options: ['Visual disturbances', 'Nausea', 'Sensitivity to light', 'Sensitivity to sound', 'None'],
        nextQuestions: {
          default: ['exacerbating'],
        },
      },
      exacerbating: {
        id: 'exacerbating',
        text: 'What makes the headache worse?',
        type: 'multiple_choice',
        options: ['Light', 'Noise', 'Movement', 'Stress', 'Certain foods', 'Nothing specific'],
        nextQuestions: {
          default: ['alleviating'],
        },
      },
      alleviating: {
        id: 'alleviating',
        text: 'What makes the headache better?',
        type: 'multiple_choice',
        options: ['Rest in dark room', 'Sleep', 'Pain medication', 'Caffeine', 'Nothing helps'],
        nextQuestions: {
          default: [],
        },
      },
    },
  },
};
