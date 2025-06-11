
// ABOUTME: Updated PatientContext that uses Supabase database instead of in-memory state
// ABOUTME: Maintains backward compatibility with existing components while adding database persistence

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { 
  createPatient, 
  getPatients, 
  updatePatient, 
  deletePatient, 
  createAssessment,
  getAssessment,
  updateAssessment,
  getAnswers,
  saveAnswer,
  convertToLegacyPatient,
  convertFromLegacyPatient
} from '@/utils/database';
import { Patient, Assessment, Answer, LegacyPatient } from '@/types/database';

// Export Patient type for other components
export type { LegacyPatient as Patient };

interface PatientContextType {
  patients: LegacyPatient[];
  currentPatient: LegacyPatient | null;
  currentAssessment: Assessment | null;
  setCurrentPatient: (patient: LegacyPatient | null) => void;
  addPatient: (patient: LegacyPatient) => Promise<void>;
  updatePatient: (patient: LegacyPatient) => Promise<void>;
  removePatient: (id: string) => Promise<void>;
  saveResponses: (responses: Record<string, any>) => Promise<void>;
  setChiefComplaint: (complaint: string) => Promise<void>;
  setSummary: (summary: string) => Promise<void>;
  loading: boolean;
  refreshPatients: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<LegacyPatient[]>([]);
  const [currentPatient, setCurrentPatientState] = useState<LegacyPatient | null>(null);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load patients from database
  const refreshPatients = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const dbPatients = await getPatients();
      const legacyPatients = dbPatients.map(patient => convertToLegacyPatient(patient));
      setPatients(legacyPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load patients when user changes
  useEffect(() => {
    if (user) {
      refreshPatients();
    } else {
      setPatients([]);
      setCurrentPatientState(null);
      setCurrentAssessment(null);
    }
  }, [user]);

  const addPatient = async (patient: LegacyPatient) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Create patient in database
      const dbPatient = await createPatient(convertFromLegacyPatient(patient));
      
      // Create initial assessment
      const assessment = await createAssessment(dbPatient.id, patient.chiefComplaint);
      
      // Convert back to legacy format
      const legacyPatient = convertToLegacyPatient(dbPatient, assessment);
      
      setPatients(prev => [legacyPatient, ...prev]);
      setCurrentPatientState(legacyPatient);
      setCurrentAssessment(assessment);
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePatientFunc = async (updatedPatient: LegacyPatient) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update patient in database
      await updatePatient(updatedPatient.id, convertFromLegacyPatient(updatedPatient));
      
      // Update assessment if chief complaint changed
      if (currentAssessment && updatedPatient.chiefComplaint !== currentPatient?.chiefComplaint) {
        await updateAssessment(currentAssessment.id, {
          chief_complaint: updatedPatient.chiefComplaint
        });
      }
      
      // Update local state
      setPatients(prev => 
        prev.map(patient => 
          patient.id === updatedPatient.id ? updatedPatient : patient
        )
      );
      
      if (currentPatient?.id === updatedPatient.id) {
        setCurrentPatientState(updatedPatient);
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removePatient = async (id: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await deletePatient(id);
      
      setPatients(prev => prev.filter(patient => patient.id !== id));
      
      if (currentPatient?.id === id) {
        setCurrentPatientState(null);
        setCurrentAssessment(null);
      }
    } catch (error) {
      console.error('Error removing patient:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveResponses = async (responses: Record<string, any>) => {
    if (!currentAssessment) return;
    
    try {
      // Save each response as an answer
      for (const [question, answer] of Object.entries(responses)) {
        if (answer && answer !== '') {
          await saveAnswer(
            currentAssessment.id,
            null, // question_id - null for now since we don't have structured questions yet
            question,
            String(answer),
            undefined,
            'history'
          );
        }
      }
      
      // Update current patient with responses
      if (currentPatient) {
        const updatedPatient = {
          ...currentPatient,
          responses: {
            ...(currentPatient.responses || {}),
            ...responses,
          },
        };
        setCurrentPatientState(updatedPatient);
      }
    } catch (error) {
      console.error('Error saving responses:', error);
      throw error;
    }
  };

  const setChiefComplaint = async (complaint: string) => {
    if (!currentPatient || !currentAssessment) return;
    
    try {
      await updateAssessment(currentAssessment.id, {
        chief_complaint: complaint
      });
      
      const updatedPatient = {
        ...currentPatient,
        chiefComplaint: complaint,
      };
      setCurrentPatientState(updatedPatient);
      
      // Update patients list
      setPatients(prev => 
        prev.map(patient => 
          patient.id === updatedPatient.id ? updatedPatient : patient
        )
      );
    } catch (error) {
      console.error('Error setting chief complaint:', error);
      throw error;
    }
  };

  const setSummary = async (summary: string) => {
    if (!currentPatient) return;
    
    const updatedPatient = {
      ...currentPatient,
      summary,
    };
    setCurrentPatientState(updatedPatient);
    
    // Update patients list
    setPatients(prev => 
      prev.map(patient => 
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
  };

  const setCurrentPatient = async (patient: LegacyPatient | null) => {
    setCurrentPatientState(patient);
    
    if (patient) {
      try {
        // Try to find or create an assessment for this patient
        // For now, we'll assume there's always one assessment per patient
        // This will be enhanced later when we support multiple assessments
        setCurrentAssessment(null); // Will be implemented when we have assessment management
      } catch (error) {
        console.error('Error setting current patient:', error);
      }
    } else {
      setCurrentAssessment(null);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        currentPatient,
        currentAssessment,
        setCurrentPatient,
        addPatient,
        updatePatient: updatePatientFunc,
        removePatient,
        saveResponses,
        setChiefComplaint,
        setSummary,
        loading,
        refreshPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
