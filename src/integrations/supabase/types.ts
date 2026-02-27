export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      academic_terms: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          is_current: boolean | null
          start_date: string
          term_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          is_current?: boolean | null
          start_date: string
          term_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          is_current?: boolean | null
          start_date?: string
          term_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faculty: {
        Row: {
          availability: Json | null
          created_at: string | null
          department: string
          designation: string
          employee_id: string
          id: string
          is_active: boolean | null
          max_hours_per_week: number | null
          specialization: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          availability?: Json | null
          created_at?: string | null
          department: string
          designation: string
          employee_id: string
          id?: string
          is_active?: boolean | null
          max_hours_per_week?: number | null
          specialization?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          availability?: Json | null
          created_at?: string | null
          department?: string
          designation?: string
          employee_id?: string
          id?: string
          is_active?: boolean | null
          max_hours_per_week?: number | null
          specialization?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      faculty_subjects: {
        Row: {
          academic_term_id: string
          can_teach_lab: boolean | null
          can_teach_theory: boolean | null
          created_at: string | null
          faculty_id: string
          id: string
          preference_score: number | null
          subject_id: string
        }
        Insert: {
          academic_term_id: string
          can_teach_lab?: boolean | null
          can_teach_theory?: boolean | null
          created_at?: string | null
          faculty_id: string
          id?: string
          preference_score?: number | null
          subject_id: string
        }
        Update: {
          academic_term_id?: string
          can_teach_lab?: boolean | null
          can_teach_theory?: boolean | null
          created_at?: string | null
          faculty_id?: string
          id?: string
          preference_score?: number | null
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_subjects_academic_term_id_fkey"
            columns: ["academic_term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_subjects_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          building: string | null
          capacity: number
          created_at: string | null
          facilities: string[] | null
          floor: number | null
          id: string
          is_available: boolean | null
          room_name: string
          room_number: string
          room_type: Database["public"]["Enums"]["room_type"]
          updated_at: string | null
        }
        Insert: {
          building?: string | null
          capacity: number
          created_at?: string | null
          facilities?: string[] | null
          floor?: number | null
          id?: string
          is_available?: boolean | null
          room_name: string
          room_number: string
          room_type: Database["public"]["Enums"]["room_type"]
          updated_at?: string | null
        }
        Update: {
          building?: string | null
          capacity?: number
          created_at?: string | null
          facilities?: string[] | null
          floor?: number | null
          id?: string
          is_available?: boolean | null
          room_name?: string
          room_number?: string
          room_type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          academic_year: string
          admission_date: string
          blood_group: string | null
          course: string
          created_at: string
          department: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          expected_graduation: string | null
          guardian_email: string | null
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          medical_conditions: string | null
          semester: number | null
          student_id: string
          updated_at: string
          user_id: string
          year_of_study: number | null
        }
        Insert: {
          academic_year: string
          admission_date?: string
          blood_group?: string | null
          course: string
          created_at?: string
          department: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          expected_graduation?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          medical_conditions?: string | null
          semester?: number | null
          student_id: string
          updated_at?: string
          user_id: string
          year_of_study?: number | null
        }
        Update: {
          academic_year?: string
          admission_date?: string
          blood_group?: string | null
          course?: string
          created_at?: string
          department?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          expected_graduation?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          medical_conditions?: string | null
          semester?: number | null
          student_id?: string
          updated_at?: string
          user_id?: string
          year_of_study?: number | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string | null
          credits: number
          department: string
          id: string
          is_active: boolean | null
          lab_hours: number | null
          semester: number
          subject_code: string
          subject_name: string
          theory_hours: number | null
          tutorial_hours: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits: number
          department: string
          id?: string
          is_active?: boolean | null
          lab_hours?: number | null
          semester: number
          subject_code: string
          subject_name: string
          theory_hours?: number | null
          tutorial_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits?: number
          department?: string
          id?: string
          is_active?: boolean | null
          lab_hours?: number | null
          semester?: number
          subject_code?: string
          subject_name?: string
          theory_hours?: number | null
          tutorial_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string | null
          duration_minutes: number
          end_time: string
          id: string
          is_active: boolean | null
          slot_name: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes: number
          end_time: string
          id?: string
          is_active?: boolean | null
          slot_name: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          slot_name?: string
          start_time?: string
        }
        Relationships: []
      }
      timetable: {
        Row: {
          academic_term_id: string
          created_at: string | null
          created_by: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          faculty_id: string
          id: string
          is_confirmed: boolean | null
          notes: string | null
          room_id: string
          session_type: Database["public"]["Enums"]["session_type"]
          student_group: string | null
          subject_id: string
          time_slot_id: string
          timetable_type: Database["public"]["Enums"]["timetable_type"] | null
          updated_at: string | null
        }
        Insert: {
          academic_term_id: string
          created_at?: string | null
          created_by?: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          faculty_id: string
          id?: string
          is_confirmed?: boolean | null
          notes?: string | null
          room_id: string
          session_type: Database["public"]["Enums"]["session_type"]
          student_group?: string | null
          subject_id: string
          time_slot_id: string
          timetable_type?: Database["public"]["Enums"]["timetable_type"] | null
          updated_at?: string | null
        }
        Update: {
          academic_term_id?: string
          created_at?: string | null
          created_by?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          faculty_id?: string
          id?: string
          is_confirmed?: boolean | null
          notes?: string | null
          room_id?: string
          session_type?: Database["public"]["Enums"]["session_type"]
          student_group?: string | null
          subject_id?: string
          time_slot_id?: string
          timetable_type?: Database["public"]["Enums"]["timetable_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timetable_academic_term_id_fkey"
            columns: ["academic_term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
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
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
      room_type:
        | "classroom"
        | "laboratory"
        | "auditorium"
        | "seminar_hall"
        | "exam_hall"
      session_type: "lecture" | "lab" | "tutorial" | "exam" | "seminar"
      timetable_type: "regular" | "exam"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      room_type: [
        "classroom",
        "laboratory",
        "auditorium",
        "seminar_hall",
        "exam_hall",
      ],
      session_type: ["lecture", "lab", "tutorial", "exam", "seminar"],
      timetable_type: ["regular", "exam"],
    },
  },
} as const
