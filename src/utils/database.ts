
// ABOUTME: Database utility functions for interacting with Supabase
// ABOUTME: Handles CRUD operations for patients, assessments, and related data

import { supabase } from '@/integrations/supabase/client';
import { Patient, Assessment, Complaint, Answer, LegacyPatient } from '@/types/database';

// Patient operations
export const createPatient = async (patientData: Omit<Patient, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('patients')
    .insert([{
      ...patientData,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Patient;
};

export const getPatients = async (): Promise<Patient[]> => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Patient[];
};

export const updatePatient = async (id: string, updates: Partial<Patient>) => {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Patient;
};

export const deletePatient = async (id: string) => {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Assessment operations
export const createAssessment = async (patientId: string, chiefComplaint?: string) => {
  const { data, error } = await supabase
    .from('assessments')
    .insert([{
      patient_id: patientId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      chief_complaint: chiefComplaint,
      status: 'in_progress' as const
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Assessment;
};

export const getAssessment = async (id: string): Promise<Assessment> => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Assessment;
};

export const updateAssessment = async (id: string, updates: Partial<Assessment>) => {
  const { data, error } = await supabase
    .from('assessments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Assessment;
};

// Complaint operations
export const getComplaints = async (): Promise<Complaint[]> => {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('name');

  if (error) throw error;
  return (data || []) as Complaint[];
};

// Answer operations
export const saveAnswer = async (assessmentId: string, questionId: string | null, questionText: string, answerValue: string, notes?: string, category?: string) => {
  const { data, error } = await supabase
    .from('answers')
    .insert([{
      assessment_id: assessmentId,
      question_id: questionId,
      question_text: questionText,
      answer_value: answerValue,
      notes,
      category,
      is_positive: answerValue === 'Yes' || answerValue === 'true'
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Answer;
};

export const getAnswers = async (assessmentId: string): Promise<Answer[]> => {
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('assessment_id', assessmentId)
    .order('created_at');

  if (error) throw error;
  return (data || []) as Answer[];
};

// Utility function to convert database patient to legacy format
export const convertToLegacyPatient = (patient: Patient, assessment?: Assessment, answers?: Answer[]): LegacyPatient => {
  const responses: Record<string, any> = {};
  
  if (answers) {
    answers.forEach(answer => {
      const key = answer.question_id || answer.question_text || 'unknown';
      responses[key] = answer.answer_value;
    });
  }

  return {
    id: patient.id,
    firstName: patient.first_name,
    lastName: patient.last_name,
    age: patient.age,
    gender: patient.gender,
    contactInfo: patient.contact_info || '',
    dateOfVisit: assessment?.date_of_visit || patient.created_at,
    chiefComplaint: assessment?.chief_complaint,
    responses,
    summary: '' // Will be generated later
  };
};

// Utility function to convert legacy patient to database format
export const convertFromLegacyPatient = (legacyPatient: LegacyPatient): Omit<Patient, 'id' | 'user_id' | 'created_at' | 'updated_at'> => {
  return {
    first_name: legacyPatient.firstName,
    last_name: legacyPatient.lastName,
    age: legacyPatient.age,
    gender: legacyPatient.gender as 'Male' | 'Female' | 'Other',
    contact_info: legacyPatient.contactInfo,
    location: undefined,
    mrn: undefined
  };
};
