export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      answers: {
        Row: {
          answer_value: string
          assessment_id: string
          category: string | null
          created_at: string
          id: string
          is_positive: boolean | null
          notes: string | null
          question_id: string | null
          question_text: string | null
        }
        Insert: {
          answer_value: string
          assessment_id: string
          category?: string | null
          created_at?: string
          id?: string
          is_positive?: boolean | null
          notes?: string | null
          question_id?: string | null
          question_text?: string | null
        }
        Update: {
          answer_value?: string
          assessment_id?: string
          category?: string | null
          created_at?: string
          id?: string
          is_positive?: boolean | null
          notes?: string | null
          question_id?: string | null
          question_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          chief_complaint: string | null
          created_at: string
          date_of_visit: string
          id: string
          patient_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chief_complaint?: string | null
          created_at?: string
          date_of_visit?: string
          id?: string
          patient_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chief_complaint?: string | null
          created_at?: string
          date_of_visit?: string
          id?: string
          patient_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_notes: {
        Row: {
          assessment_id: string
          content: Json
          created_at: string
          formatted_text: string | null
          id: string
          note_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_id: string
          content: Json
          created_at?: string
          formatted_text?: string | null
          id?: string
          note_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_id?: string
          content?: Json
          created_at?: string
          formatted_text?: string | null
          id?: string
          note_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_notes_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          system: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          system?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          system?: string | null
        }
        Relationships: []
      }
      investigations: {
        Row: {
          assessment_id: string
          created_at: string
          id: string
          interpretation: string | null
          investigation_type: string
          name: string
          normal_range: string | null
          ordered_date: string | null
          result_date: string | null
          result_value: string | null
          status: string | null
        }
        Insert: {
          assessment_id: string
          created_at?: string
          id?: string
          interpretation?: string | null
          investigation_type: string
          name: string
          normal_range?: string | null
          ordered_date?: string | null
          result_date?: string | null
          result_value?: string | null
          status?: string | null
        }
        Update: {
          assessment_id?: string
          created_at?: string
          id?: string
          interpretation?: string | null
          investigation_type?: string
          name?: string
          normal_range?: string | null
          ordered_date?: string | null
          result_date?: string | null
          result_value?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investigations_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      past_history: {
        Row: {
          created_at: string
          date_occurred: string | null
          description: string
          history_type: string
          id: string
          notes: string | null
          patient_id: string
          severity: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          date_occurred?: string | null
          description: string
          history_type: string
          id?: string
          notes?: string | null
          patient_id: string
          severity?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          date_occurred?: string | null
          description?: string
          history_type?: string
          id?: string
          notes?: string | null
          patient_id?: string
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "past_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number
          contact_info: string | null
          created_at: string
          first_name: string
          gender: string
          id: string
          last_name: string
          location: string | null
          mrn: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age: number
          contact_info?: string | null
          created_at?: string
          first_name: string
          gender: string
          id?: string
          last_name: string
          location?: string | null
          mrn?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          contact_info?: string | null
          created_at?: string
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          location?: string | null
          mrn?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string | null
          complaint_id: string | null
          created_at: string
          id: string
          is_red_flag: boolean | null
          options: Json | null
          order_index: number | null
          question_text: string
          question_type: string | null
          system: string | null
        }
        Insert: {
          category?: string | null
          complaint_id?: string | null
          created_at?: string
          id?: string
          is_red_flag?: boolean | null
          options?: Json | null
          order_index?: number | null
          question_text: string
          question_type?: string | null
          system?: string | null
        }
        Update: {
          category?: string | null
          complaint_id?: string | null
          created_at?: string
          id?: string
          is_red_flag?: boolean | null
          options?: Json | null
          order_index?: number | null
          question_text?: string
          question_type?: string | null
          system?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
