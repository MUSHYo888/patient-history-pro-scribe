export interface Question {
  id: string;
  text: string;
  type: 'yes_no' | 'multiple_choice' | 'text' | 'date' | 'number';
  options?: string[];
  nextQuestions?: Record<string, string[]>;
  isRedFlag?: boolean;
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
  'abdominal-pain': {
    id: 'abdominal-pain',
    name: 'Abdominal Pain',
    initialQuestion: 'onset',
    questions: {
      onset: {
        id: 'onset',
        text: 'When did the abdominal pain start?',
        type: 'date',
        nextQuestions: {
          default: ['onset_type'],
        },
      },
      onset_type: {
        id: 'onset_type',
        text: 'How did the pain begin?',
        type: 'multiple_choice',
        options: ['Suddenly', 'Gradually', 'After eating', 'After injury', 'Woke up with it'],
        nextQuestions: {
          default: ['character'],
        },
      },
      character: {
        id: 'character',
        text: 'How would you describe the pain?',
        type: 'multiple_choice',
        options: ['Sharp/stabbing', 'Dull/aching', 'Cramping', 'Burning', 'Pressure/fullness', 'Colicky (comes in waves)'],
        nextQuestions: {
          default: ['location'],
        },
      },
      location: {
        id: 'location',
        text: 'Where is the pain located?',
        type: 'multiple_choice',
        options: [
          'Right upper quadrant', 
          'Left upper quadrant', 
          'Right lower quadrant', 
          'Left lower quadrant', 
          'Periumbilical (around the belly button)', 
          'Epigastric (upper middle)',
          'Lower abdomen',
          'Entire abdomen',
        ],
        nextQuestions: {
          default: ['radiation'],
        },
      },
      radiation: {
        id: 'radiation',
        text: 'Does the pain radiate to other areas?',
        type: 'multiple_choice',
        options: ['No', 'Back', 'Chest', 'Groin', 'Shoulder', 'Elsewhere'],
        nextQuestions: {
          'No': ['severity'],
          'Back': ['red_flag_pancreatitis'],
          'Chest': ['red_flag_cardiac'],
          'Shoulder': ['red_flag_ruptured_organs'], 
          default: ['severity'],
        },
      },
      severity: {
        id: 'severity',
        text: 'On a scale of 1-10, how severe is the pain?',
        type: 'number',
        nextQuestions: {
          default: ['timing'],
        },
      },
      timing: {
        id: 'timing',
        text: 'How often does this pain occur?',
        type: 'multiple_choice',
        options: ['Constant', 'Intermittent', 'Comes and goes in waves', 'Only after specific triggers'],
        nextQuestions: {
          default: ['duration'],
        },
      },
      duration: {
        id: 'duration',
        text: 'How long does the pain typically last?',
        type: 'multiple_choice',
        options: ['Seconds', 'Minutes', 'Hours', 'Days', 'Constant'],
        nextQuestions: {
          default: ['exacerbating'],
        },
      },
      exacerbating: {
        id: 'exacerbating',
        text: 'What makes the pain worse?',
        type: 'multiple_choice',
        options: ['Eating', 'Movement', 'Coughing', 'Breathing deeply', 'Lying down', 'Standing up', 'Nothing specific'],
        nextQuestions: {
          'Eating': ['food_relation'],
          default: ['alleviating'],
        },
      },
      food_relation: {
        id: 'food_relation',
        text: 'How soon after eating does the pain worsen?',
        type: 'multiple_choice',
        options: ['Immediately', '15-30 minutes', '1-2 hours', 'Several hours'],
        nextQuestions: {
          default: ['alleviating'],
        },
      },
      alleviating: {
        id: 'alleviating',
        text: 'What makes the pain better?',
        type: 'multiple_choice',
        options: ['Rest', 'Eating', 'Antacids', 'Pain medication', 'Bowel movement', 'Vomiting', 'Nothing helps'],
        nextQuestions: {
          default: ['associated'],
        },
      },
      associated: {
        id: 'associated',
        text: 'Are there any associated symptoms?',
        type: 'multiple_choice',
        options: [
          'Nausea/vomiting', 
          'Diarrhea', 
          'Constipation', 
          'Loss of appetite', 
          'Bloating',
          'Fever',
          'Jaundice (yellowing of skin/eyes)',
          'Blood in stool',
          'None'
        ],
        nextQuestions: {
          'Fever': ['red_flag_infection'],
          'Jaundice (yellowing of skin/eyes)': ['red_flag_liver'],
          'Blood in stool': ['red_flag_bleeding'],
          'Nausea/vomiting': ['nausea_details'],
          default: ['recent_changes'],
        },
      },
      nausea_details: {
        id: 'nausea_details',
        text: 'If vomiting, describe what it looks like:',
        type: 'multiple_choice',
        options: ['Food contents', 'Clear or yellow/green fluid', 'Coffee-ground appearance', 'Bright red blood', 'Not vomiting'],
        nextQuestions: {
          'Coffee-ground appearance': ['red_flag_gi_bleed'],
          'Bright red blood': ['red_flag_gi_bleed'],
          default: ['recent_changes'],
        },
      },
      recent_changes: {
        id: 'recent_changes',
        text: 'Have there been any recent changes in your bowel habits?',
        type: 'multiple_choice',
        options: ['More frequent', 'Less frequent', 'Looser/watery', 'Harder/constipated', 'Mucus present', 'No change'],
        nextQuestions: {
          default: ['medical_history'],
        },
      },
      medical_history: {
        id: 'medical_history',
        text: 'Do you have any known medical conditions?',
        type: 'multiple_choice',
        options: [
          'Gallstones', 
          'Ulcers', 
          'Inflammatory bowel disease', 
          'Irritable bowel syndrome',
          'Pancreatitis',
          'Liver disease',
          'Kidney disease',
          'Cancer',
          'None of the above'
        ],
        nextQuestions: {
          default: ['previous_surgery'],
        },
      },
      previous_surgery: {
        id: 'previous_surgery',
        text: 'Have you had any abdominal surgeries in the past?',
        type: 'multiple_choice',
        options: ['Yes, within the past month', 'Yes, within the past year', 'Yes, more than a year ago', 'No'],
        nextQuestions: {
          'Yes, within the past month': ['red_flag_postsurgical'],
          default: ['female_questions'],
        },
      },
      female_questions: {
        id: 'female_questions',
        text: 'For female patients: Could this pain be related to your menstrual cycle?',
        type: 'multiple_choice',
        options: ['Yes', 'No', 'Not applicable'],
        nextQuestions: {
          'Yes': ['menstrual_details'],
          default: ['last_meal'],
        },
      },
      menstrual_details: {
        id: 'menstrual_details',
        text: 'Where are you in your menstrual cycle?',
        type: 'multiple_choice',
        options: ['Currently menstruating', 'Just before period', 'Mid-cycle', 'Just after period', 'Irregular cycle'],
        nextQuestions: {
          default: ['pregnancy_status'],
        },
      },
      pregnancy_status: {
        id: 'pregnancy_status',
        text: 'Is there any possibility you could be pregnant?',
        type: 'yes_no',
        nextQuestions: {
          'Yes': ['red_flag_pregnancy'],
          'No': ['last_meal'],
        },
      },
      last_meal: {
        id: 'last_meal',
        text: 'When was your last meal?',
        type: 'multiple_choice',
        options: ['Less than 2 hours ago', '2-6 hours ago', '6-12 hours ago', 'More than 12 hours ago'],
        nextQuestions: {
          default: [],
        },
      },
      // Red flag questions
      red_flag_pancreatitis: {
        id: 'red_flag_pancreatitis',
        text: 'Is the pain severe and does it go straight through to your back?',
        type: 'yes_no',
        isRedFlag: true,
        nextQuestions: {
          default: ['severity'],
        },
      },
      red_flag_cardiac: {
        id: 'red_flag_cardiac',
        text: 'Do you also have shortness of breath or pressure in your chest?',
        type: 'yes_no',
        isRedFlag: true,
        nextQuestions: {
          default: ['severity'],
        },
      },
      red_flag_ruptured_organs: {
        id: 'red_flag_ruptured_organs',
        text: 'Is the pain very sudden and severe, and do you have a rigid/board-like abdomen?',
        type: 'yes_no',
        isRedFlag: true,
        nextQuestions: {
          default: ['severity'],
        },
      },
      red_flag_infection: {
        id: 'red_flag_infection',
        text: 'How high is your fever?',
        type: 'multiple_choice',
        isRedFlag: true,
        options: ['Low grade (99-100.9°F)', 'Moderate (101-102.9°F)', 'High (103°F or higher)', 'Not measured'],
        nextQuestions: {
          default: ['recent_changes'],
        },
      },
      red_flag_liver: {
        id: 'red_flag_liver',
        text: 'How long have you noticed the yellowing of your skin or eyes?',
        type: 'multiple_choice',
        isRedFlag: true,
        options: ['Just today', 'Past few days', 'Past week', 'Longer than a week'],
        nextQuestions: {
          default: ['recent_changes'],
        },
      },
      red_flag_bleeding: {
        id: 'red_flag_bleeding',
        text: 'How would you describe the blood in your stool?',
        type: 'multiple_choice',
        isRedFlag: true,
        options: ['Bright red', 'Dark/black and tarry', 'Mixed with stool', 'On toilet paper only'],
        nextQuestions: {
          default: ['recent_changes'],
        },
      },
      red_flag_gi_bleed: {
        id: 'red_flag_gi_bleed',
        text: 'How many times have you vomited blood?',
        type: 'multiple_choice',
        isRedFlag: true,
        options: ['Just once', '2-5 times', 'More than 5 times', 'Continuously'],
        nextQuestions: {
          default: ['recent_changes'],
        },
      },
      red_flag_postsurgical: {
        id: 'red_flag_postsurgical',
        text: 'Have you noticed any redness, warmth, or discharge from your surgical site?',
        type: 'yes_no',
        isRedFlag: true,
        nextQuestions: {
          default: ['female_questions'],
        },
      },
      red_flag_pregnancy: {
        id: 'red_flag_pregnancy',
        text: 'Are you experiencing any vaginal bleeding?',
        type: 'yes_no',
        isRedFlag: true,
        nextQuestions: {
          default: ['last_meal'],
        },
      },
    },
  },
};
