import { LegacyPatient as Patient } from '@/types/database';
import { questionDatabase } from '../data/questionDatabase';

export function generateSummary(patient: Patient): string {
  if (!patient.responses || !patient.chiefComplaint) {
    return 'Insufficient data to generate summary.';
  }

  const complaintData = Object.values(questionDatabase).find(
    (complaint) => complaint.name === patient.chiefComplaint
  );

  if (!complaintData) {
    return 'Error: Complaint data not found.';
  }

  const { firstName, lastName, age, gender, dateOfVisit } = patient;
  
  let summaryParts = [];
  
  // Demographics
  summaryParts.push(`# PATIENT HISTORY\n`);
  summaryParts.push(`## DEMOGRAPHICS`);
  summaryParts.push(`${firstName} ${lastName}, ${age} year old ${gender}`);
  summaryParts.push(`Date of Visit: ${dateOfVisit}\n`);
  
  // Chief Complaint
  summaryParts.push(`## CHIEF COMPLAINT`);
  summaryParts.push(`${patient.chiefComplaint}\n`);
  
  // History of Present Illness
  summaryParts.push(`## HISTORY OF PRESENT ILLNESS`);
  
  const responses = patient.responses;
  let hpi = `Patient presents with ${patient.chiefComplaint.toLowerCase()}`;
  
  // Process onset
  if (responses.onset) {
    const onsetDate = new Date(responses.onset);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - onsetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      hpi += ` that started today.`;
    } else if (diffDays === 1) {
      hpi += ` that started yesterday.`;
    } else {
      hpi += ` that started ${diffDays} days ago.`;
    }
  }
  
  // Process onset type
  if (responses.onset_type) {
    hpi += ` The onset was ${responses.onset_type.toLowerCase()}.`;
  }
  
  // Process character
  if (responses.character) {
    hpi += ` The pain is described as ${responses.character.toLowerCase()}.`;
  }
  
  // Process location
  if (responses.location) {
    hpi += ` It is located in the ${responses.location.toLowerCase()}.`;
  }
  
  // Process radiation
  if (responses.radiation && responses.radiation !== 'No') {
    hpi += ` The pain radiates to the ${responses.radiation.toLowerCase()}.`;
  }
  
  // Process severity
  if (responses.severity) {
    hpi += ` Patient rates the pain as ${responses.severity}/10 in severity.`;
  }
  
  // Process timing
  if (responses.timing) {
    hpi += ` The pain is ${responses.timing.toLowerCase()}.`;
  }
  
  // Process duration
  if (responses.duration) {
    hpi += ` Episodes typically last for ${responses.duration.toLowerCase()}.`;
  }
  
  // Process exacerbating factors
  if (responses.exacerbating) {
    hpi += ` The pain is worsened by ${responses.exacerbating.toLowerCase()}.`;
  }

  // Process food relation
  if (responses.food_relation) {
    hpi += ` Pain worsens ${responses.food_relation.toLowerCase()} after eating.`;
  }
  
  // Process alleviating factors
  if (responses.alleviating) {
    hpi += ` The pain is alleviated by ${responses.alleviating.toLowerCase()}.`;
  }
  
  // Process associated symptoms
  if (responses.associated && responses.associated !== 'None') {
    hpi += ` Associated symptoms include ${responses.associated.toLowerCase()}.`;
  }
  
  // Process nausea details
  if (responses.nausea_details && responses.nausea_details !== 'Not vomiting') {
    hpi += ` Vomitus appears as ${responses.nausea_details.toLowerCase()}.`;
  }
  
  // Process recent changes
  if (responses.recent_changes && responses.recent_changes !== 'No change') {
    hpi += ` Patient reports ${responses.recent_changes.toLowerCase()} bowel movements.`;
  }
  
  // Process medical history
  if (responses.medical_history && responses.medical_history !== 'None of the above') {
    hpi += ` Medical history significant for ${responses.medical_history.toLowerCase()}.`;
  }
  
  // Process surgical history
  if (responses.previous_surgery) {
    if (responses.previous_surgery === 'No') {
      hpi += ` No history of abdominal surgeries.`;
    } else {
      hpi += ` History of abdominal surgery ${responses.previous_surgery.toLowerCase()}.`;
    }
  }
  
  // Process female-specific questions
  if (responses.female_questions && responses.female_questions !== 'Not applicable') {
    if (responses.female_questions === 'Yes') {
      hpi += ` Patient believes pain may be related to menstrual cycle.`;
      
      if (responses.menstrual_details) {
        hpi += ` Patient is ${responses.menstrual_details.toLowerCase()}.`;
      }
      
      if (responses.pregnancy_status) {
        if (responses.pregnancy_status === 'Yes') {
          hpi += ` Patient states possible pregnancy.`;
        } else {
          hpi += ` Patient denies possibility of pregnancy.`;
        }
      }
    } else {
      hpi += ` Patient denies relation to menstrual cycle.`;
    }
  }
  
  // Process last meal
  if (responses.last_meal) {
    hpi += ` Last meal was ${responses.last_meal.toLowerCase()}.`;
  }
  
  // Process red flag questions
  let redFlagNotes = '';
  
  // Helper function to check if a red flag question ID exists in responses
  const hasRedFlag = (id: string) => responses[id] && responses[id] === 'Yes';
  
  if (hasRedFlag('red_flag_pancreatitis')) {
    redFlagNotes += ` Reports severe pain radiating straight through to the back, concerning for possible pancreatitis.`;
  }
  
  if (hasRedFlag('red_flag_cardiac')) {
    redFlagNotes += ` Reports concomitant chest pressure and shortness of breath, warranting cardiac evaluation.`;
  }
  
  if (hasRedFlag('red_flag_ruptured_organs')) {
    redFlagNotes += ` Presents with sudden, severe pain and rigid abdomen, concerning for possible peritonitis.`;
  }
  
  if (responses.red_flag_infection && responses.red_flag_infection !== 'Not measured') {
    redFlagNotes += ` Reports ${responses.red_flag_infection.toLowerCase()} fever.`;
  }
  
  if (responses.red_flag_liver) {
    redFlagNotes += ` Jaundice present for ${responses.red_flag_liver.toLowerCase()}.`;
  }
  
  if (responses.red_flag_bleeding) {
    redFlagNotes += ` Reports ${responses.red_flag_bleeding.toLowerCase()} blood in stool.`;
  }
  
  if (responses.red_flag_gi_bleed && responses.red_flag_gi_bleed !== 'Not vomiting') {
    redFlagNotes += ` Has vomited blood ${responses.red_flag_gi_bleed.toLowerCase()}.`;
  }
  
  if (hasRedFlag('red_flag_postsurgical')) {
    redFlagNotes += ` Post-surgical site shows signs of possible infection.`;
  }
  
  if (hasRedFlag('red_flag_pregnancy')) {
    redFlagNotes += ` Pregnant patient with vaginal bleeding, requiring urgent evaluation.`;
  }
  
  if (redFlagNotes) {
    summaryParts.push(hpi);
    summaryParts.push(`\n### WARNING: Red Flag Symptoms Present`);
    summaryParts.push(redFlagNotes.trim());
  } else {
    summaryParts.push(hpi);
  }
  
  // Add Assessment and Plan sections for completeness
  summaryParts.push(`\n## ASSESSMENT`);
  summaryParts.push(`${patient.chiefComplaint} - evaluation in progress`);
  
  summaryParts.push(`\n## PLAN`);
  summaryParts.push(`1. Complete history and physical examination`);
  summaryParts.push(`2. Consider diagnostic testing based on clinical presentation`);
  summaryParts.push(`3. Provide symptomatic relief as appropriate`);
  
  // Format other responses that weren't explicitly handled
  const handledQuestions = [
    'onset', 'onset_type', 'character', 'location', 'radiation', 'severity', 
    'timing', 'duration', 'exacerbating', 'food_relation', 'alleviating', 'associated',
    'nausea_details', 'recent_changes', 'medical_history', 'previous_surgery',
    'female_questions', 'menstrual_details', 'pregnancy_status', 'last_meal',
    'red_flag_pancreatitis', 'red_flag_cardiac', 'red_flag_ruptured_organs',
    'red_flag_infection', 'red_flag_liver', 'red_flag_bleeding', 'red_flag_gi_bleed',
    'red_flag_postsurgical', 'red_flag_pregnancy'
  ];
  
  Object.entries(responses).forEach(([key, value]) => {
    if (!handledQuestions.includes(key)) {
      const question = complaintData.questions[key];
      if (question) {
        hpi += ` ${question.text} ${value}.`;
      }
    }
  });
  
  // Complete summary
  return summaryParts.join('\n');
}
