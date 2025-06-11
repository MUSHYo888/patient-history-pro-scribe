
-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  contact_info TEXT,
  location TEXT,
  mrn TEXT UNIQUE, -- Medical Record Number
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessments table (each patient encounter)
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  chief_complaint TEXT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'reviewed')),
  date_of_visit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create complaints table (predefined chief complaints)
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  system TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table (dynamic and static questions)
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id UUID REFERENCES public.complaints(id),
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('yes_no', 'multiple_choice', 'text', 'numeric')),
  options JSONB, -- For multiple choice options
  category TEXT, -- e.g., 'history', 'ros', 'physical_exam'
  system TEXT, -- e.g., 'cardiovascular', 'respiratory'
  order_index INTEGER DEFAULT 0,
  is_red_flag BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create answers table (patient responses)
CREATE TABLE public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id),
  question_text TEXT, -- Store question text for AI-generated questions
  answer_value TEXT NOT NULL,
  notes TEXT,
  category TEXT,
  is_positive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clinical_notes table (summaries and progress notes)
CREATE TABLE public.clinical_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  note_type TEXT DEFAULT 'assessment' CHECK (note_type IN ('assessment', 'progress', 'differential')),
  content JSONB NOT NULL, -- Structured note content
  formatted_text TEXT, -- Final formatted note
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create past_history table (PMH, PDH, Family, Social history)
CREATE TABLE public.past_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  history_type TEXT NOT NULL CHECK (history_type IN ('medical', 'surgical', 'drug', 'allergy', 'family', 'social')),
  description TEXT NOT NULL,
  date_occurred DATE,
  severity TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'chronic')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investigations table (lab orders and results)
CREATE TABLE public.investigations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  investigation_type TEXT NOT NULL, -- e.g., 'lab', 'imaging', 'ecg'
  name TEXT NOT NULL,
  ordered_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  result_value TEXT,
  result_date TIMESTAMP WITH TIME ZONE,
  normal_range TEXT,
  interpretation TEXT,
  status TEXT DEFAULT 'ordered' CHECK (status IN ('ordered', 'pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Users can view their own patients" 
  ON public.patients FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own patients" 
  ON public.patients FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients" 
  ON public.patients FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patients" 
  ON public.patients FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for assessments
CREATE POLICY "Users can view their own assessments" 
  ON public.assessments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
  ON public.assessments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
  ON public.assessments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" 
  ON public.assessments FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for complaints (public read access)
CREATE POLICY "Anyone can view complaints" 
  ON public.complaints FOR SELECT 
  TO authenticated
  USING (true);

-- RLS Policies for questions (public read access)
CREATE POLICY "Anyone can view questions" 
  ON public.questions FOR SELECT 
  TO authenticated
  USING (true);

-- RLS Policies for answers
CREATE POLICY "Users can view answers for their assessments" 
  ON public.answers FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create answers for their assessments" 
  ON public.answers FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update answers for their assessments" 
  ON public.answers FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete answers for their assessments" 
  ON public.answers FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

-- RLS Policies for clinical_notes
CREATE POLICY "Users can view their own clinical notes" 
  ON public.clinical_notes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clinical notes" 
  ON public.clinical_notes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clinical notes" 
  ON public.clinical_notes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clinical notes" 
  ON public.clinical_notes FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for past_history
CREATE POLICY "Users can view past history for their patients" 
  ON public.past_history FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.patients 
    WHERE id = patient_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create past history for their patients" 
  ON public.past_history FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.patients 
    WHERE id = patient_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update past history for their patients" 
  ON public.past_history FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.patients 
    WHERE id = patient_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete past history for their patients" 
  ON public.past_history FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.patients 
    WHERE id = patient_id AND user_id = auth.uid()
  ));

-- RLS Policies for investigations
CREATE POLICY "Users can view investigations for their assessments" 
  ON public.investigations FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create investigations for their assessments" 
  ON public.investigations FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update investigations for their assessments" 
  ON public.investigations FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete investigations for their assessments" 
  ON public.investigations FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER patients_updated_at 
  BEFORE UPDATE ON public.patients 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER assessments_updated_at 
  BEFORE UPDATE ON public.assessments 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER clinical_notes_updated_at 
  BEFORE UPDATE ON public.clinical_notes 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial complaint data
INSERT INTO public.complaints (name, category, system) VALUES
('Chest Pain', 'Pain', 'Cardiovascular'),
('Shortness of Breath', 'Respiratory', 'Respiratory'),
('Headache', 'Pain', 'Neurological'),
('Abdominal Pain', 'Pain', 'Gastrointestinal'),
('Back Pain', 'Pain', 'Musculoskeletal'),
('Fever', 'Constitutional', 'General'),
('Cough', 'Respiratory', 'Respiratory'),
('Dizziness', 'Neurological', 'Neurological'),
('Fatigue', 'Constitutional', 'General'),
('Nausea and Vomiting', 'Gastrointestinal', 'Gastrointestinal'),
('Joint Pain', 'Pain', 'Musculoskeletal'),
('Skin Rash', 'Dermatological', 'Dermatological'),
('Palpitations', 'Cardiovascular', 'Cardiovascular'),
('Weight Loss', 'Constitutional', 'General'),
('Swelling', 'General', 'General');
