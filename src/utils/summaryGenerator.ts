
import { Patient } from '../context/PatientContext';
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
  
  // Process exacerbating factors
  if (responses.exacerbating) {
    hpi += ` The pain is worsened by ${responses.exacerbating.toLowerCase()}.`;
  }
  
  // Process alleviating factors
  if (responses.alleviating) {
    hpi += ` The pain is alleviated by ${responses.alleviating.toLowerCase()}.`;
  }
  
  // Process associated symptoms
  if (responses.associated && responses.associated !== 'None') {
    hpi += ` Associated symptoms include ${responses.associated.toLowerCase()}.`;
  }
  
  // Format other responses
  Object.entries(responses).forEach(([key, value]) => {
    if (!['onset', 'character', 'location', 'radiation', 'severity', 'exacerbating', 'alleviating', 'associated'].includes(key)) {
      const question = complaintData.questions[key];
      if (question) {
        hpi += ` ${question.text} ${value}.`;
      }
    }
  });
  
  summaryParts.push(hpi);
  
  // Complete summary
  return summaryParts.join('\n');
}
