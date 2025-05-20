
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Patient {
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

interface PatientContextType {
  patients: Patient[];
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
  saveResponses: (responses: Record<string, any>) => void;
  setChiefComplaint: (complaint: string) => void;
  setSummary: (summary: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  const addPatient = (patient: Patient) => {
    setPatients([...patients, patient]);
    setCurrentPatient(patient);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(
      patients.map((patient) => 
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
    if (currentPatient?.id === updatedPatient.id) {
      setCurrentPatient(updatedPatient);
    }
  };

  const removePatient = (id: string) => {
    setPatients(patients.filter((patient) => patient.id !== id));
    if (currentPatient?.id === id) {
      setCurrentPatient(null);
    }
  };

  const saveResponses = (responses: Record<string, any>) => {
    if (currentPatient) {
      const updatedPatient = {
        ...currentPatient,
        responses: {
          ...(currentPatient.responses || {}),
          ...responses,
        },
      };
      updatePatient(updatedPatient);
    }
  };

  const setChiefComplaint = (complaint: string) => {
    if (currentPatient) {
      const updatedPatient = {
        ...currentPatient,
        chiefComplaint: complaint,
      };
      updatePatient(updatedPatient);
    }
  };

  const setSummary = (summary: string) => {
    if (currentPatient) {
      const updatedPatient = {
        ...currentPatient,
        summary,
      };
      updatePatient(updatedPatient);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        currentPatient,
        setCurrentPatient,
        addPatient,
        updatePatient,
        removePatient,
        saveResponses,
        setChiefComplaint,
        setSummary,
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
