
// ABOUTME: TypeScript interfaces for the History Pro database schema
// ABOUTME: Defines all the data types used throughout the application

export interface Patient {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact_info?: string;
  location?: string;
  mrn?: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  patient_id: string;
  user_id: string;
  chief_complaint?: string;
  status: 'in_progress' | 'completed' | 'reviewed';
  date_of_visit: string;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  name: string;
  category?: string;
  system?: string;
  created_at: string;
}

export interface Question {
  id: string;
  complaint_id?: string;
  question_text: string;
  question_type: 'yes_no' | 'multiple_choice' | 'text' | 'numeric';
  options?: string[];
  category?: string;
  system?: string;
  order_index: number;
  is_red_flag: boolean;
  created_at: string;
}

export interface Answer {
  id: string;
  assessment_id: string;
  question_id?: string;
  question_text?: string;
  answer_value: string;
  notes?: string;
  category?: string;
  is_positive: boolean;
  created_at: string;
}

export interface ClinicalNote {
  id: string;
  assessment_id: string;
  user_id: string;
  note_type: 'assessment' | 'progress' | 'differential';
  content: Record<string, any>;
  formatted_text?: string;
  created_at: string;
  updated_at: string;
}

export interface PastHistory {
  id: string;
  patient_id: string;
  history_type: 'medical' | 'surgical' | 'drug' | 'allergy' | 'family' | 'social';
  description: string;
  date_occurred?: string;
  severity?: string;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
  created_at: string;
}

export interface Investigation {
  id: string;
  assessment_id: string;
  investigation_type: string;
  name: string;
  ordered_date: string;
  result_value?: string;
  result_date?: string;
  normal_range?: string;
  interpretation?: string;
  status: 'ordered' | 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

// Legacy Patient interface for backward compatibility
export interface LegacyPatient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  contactInfo: string;
  dateOfVisit: string;
  chiefComplaint?: string;
  responses?: Record<string, any>;
  summary?: string;
}
