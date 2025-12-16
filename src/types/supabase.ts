/**
 * AUTO-GENERATED SUPABASE DATABASE TYPES
 * This file contains TypeScript types for all database tables
 *
 * IMPORTANT: These types use snake_case to match PostgreSQL conventions
 * If you need camelCase in your components, use the helper utilities in types/helpers.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string // uuid
          email: string
          role: 'admin' | 'user'
          full_name: string | null
          profile_photo: string | null
          created_at: string // timestamptz
          updated_at: string // timestamptz
        }
        Insert: {
          id?: string
          email: string
          role?: 'admin' | 'user'
          full_name?: string | null
          profile_photo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'user'
          full_name?: string | null
          profile_photo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string // uuid
          name: string
          description: string | null
          muscle_groups: string[] | null // text[]
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          video_url: string | null
          equipment: string[] | null
          instructions: string[] | null
          type: string | null
          duration: number | null // in minutes
          created_at: string
          updated_at: string
          created_by: string | null // uuid reference to users
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          muscle_groups?: string[] | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          video_url?: string | null
          equipment?: string[] | null
          instructions?: string[] | null
          type?: string | null
          duration?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          muscle_groups?: string[] | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          video_url?: string | null
          equipment?: string[] | null
          instructions?: string[] | null
          type?: string | null
          duration?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      workouts: {
        Row: {
          id: string // uuid
          name: string
          description: string | null
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          total_duration: number | null // in minutes
          type: string | null
          created_by: string // uuid reference to users
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          total_duration?: number | null
          type?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          total_duration?: number | null
          type?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      workout_exercises: {
        Row: {
          id: string // uuid
          workout_id: string // uuid reference to workouts
          exercise_id: string // uuid reference to exercises
          order_number: number
          sets: number | null
          reps: number | null
          duration: number | null // in seconds
          rest_time: number | null // in seconds
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          order_number: number
          sets?: number | null
          reps?: number | null
          duration?: number | null
          rest_time?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_id?: string
          order_number?: number
          sets?: number | null
          reps?: number | null
          duration?: number | null
          rest_time?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      workout_assignments: {
        Row: {
          id: string // uuid
          user_id: string // uuid reference to users
          workout_id: string // uuid reference to workouts
          assigned_by: string // uuid reference to users (coach)
          assigned_at: string
          scheduled_date: string | null // date
          status: 'scheduled' | 'in-progress' | 'completed' | 'skipped'
          notes: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          assigned_by: string
          assigned_at?: string
          scheduled_date?: string | null
          status?: 'scheduled' | 'in-progress' | 'completed' | 'skipped'
          notes?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string
          assigned_by?: string
          assigned_at?: string
          scheduled_date?: string | null
          status?: 'scheduled' | 'in-progress' | 'completed' | 'skipped'
          notes?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      workout_logs: {
        Row: {
          id: string // uuid
          user_id: string // uuid reference to users
          workout_id: string // uuid reference to workouts
          assignment_id: string | null // uuid reference to workout_assignments
          started_at: string
          completed_at: string | null
          status: 'in-progress' | 'completed' | 'paused'
          total_duration: number | null // in seconds
          notes: string | null
          rating: number | null // 1-5 stars
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          assignment_id?: string | null
          started_at?: string
          completed_at?: string | null
          status?: 'in-progress' | 'completed' | 'paused'
          total_duration?: number | null
          notes?: string | null
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string
          assignment_id?: string | null
          started_at?: string
          completed_at?: string | null
          status?: 'in-progress' | 'completed' | 'paused'
          total_duration?: number | null
          notes?: string | null
          rating?: number | null
          created_at?: string
        }
      }
      exercise_logs: {
        Row: {
          id: string // uuid
          workout_log_id: string // uuid reference to workout_logs
          exercise_id: string // uuid reference to exercises
          planned_sets: number | null
          planned_reps: number | null
          planned_duration: number | null
          completed_sets: number
          notes: string | null
          skipped: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_log_id: string
          exercise_id: string
          planned_sets?: number | null
          planned_reps?: number | null
          planned_duration?: number | null
          completed_sets?: number
          notes?: string | null
          skipped?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_log_id?: string
          exercise_id?: string
          planned_sets?: number | null
          planned_reps?: number | null
          planned_duration?: number | null
          completed_sets?: number
          notes?: string | null
          skipped?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      set_logs: {
        Row: {
          id: string // uuid
          exercise_log_id: string // uuid reference to exercise_logs
          set_number: number
          reps: number | null
          weight: number | null // in lbs
          duration: number | null // in seconds
          rest_time: number | null // in seconds
          rpe: number | null // Rate of Perceived Exertion (1-10)
          notes: string | null
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          exercise_log_id: string
          set_number: number
          reps?: number | null
          weight?: number | null
          duration?: number | null
          rest_time?: number | null
          rpe?: number | null
          notes?: string | null
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          exercise_log_id?: string
          set_number?: number
          reps?: number | null
          weight?: number | null
          duration?: number | null
          rest_time?: number | null
          rpe?: number | null
          notes?: string | null
          completed_at?: string
          created_at?: string
        }
      }
      nutrition_logs: {
        Row: {
          id: string // uuid
          user_id: string // uuid reference to users
          food_name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size: string | null
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          date: string // date
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size?: string | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          food_name?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          serving_size?: string | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
      nutrition_targets: {
        Row: {
          id: string // uuid
          user_id: string // uuid reference to users
          target_calories: number
          target_protein: number
          target_carbs: number
          target_fat: number
          start_date: string // date
          end_date: string | null // date
          active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_calories: number
          target_protein: number
          target_carbs: number
          target_fat: number
          start_date?: string
          end_date?: string | null
          active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_calories?: number
          target_protein?: number
          target_carbs?: number
          target_fat?: number
          start_date?: string
          end_date?: string | null
          active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_meals: {
        Row: {
          id: string // uuid
          user_id: string // uuid reference to users
          meal_name: string
          foods: Json // Array of food items with nutrition info
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fat: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_name: string
          foods: Json
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fat: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_name?: string
          foods?: Json
          total_calories?: number
          total_protein?: number
          total_carbs?: number
          total_fat?: number
          created_at?: string
          updated_at?: string
        }
      }
      weight_logs: {
        Row: {
          id: string // uuid
          user_id: string // uuid reference to users
          weight: number // in lbs
          date: string // date
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight: number
          date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
      coach_notes: {
        Row: {
          id: string // uuid
          coach_id: string // uuid reference to users
          client_id: string // uuid reference to users
          note: string
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          coach_id: string
          client_id: string
          note: string
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          coach_id?: string
          client_id?: string
          note?: string
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string // uuid
          user_id: string // uuid reference to users
          type: 'bug_report' | 'feature_request' | 'general_feedback'
          title: string
          description: string
          priority: 'low' | 'medium' | 'high' | 'critical'
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          category: string | null
          attachments: string[] | null
          created_at: string
          updated_at: string
          resolved_at: string | null
          resolved_by: string | null // uuid reference to users
          admin_notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'bug_report' | 'feature_request' | 'general_feedback'
          title: string
          description: string
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          category?: string | null
          attachments?: string[] | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'bug_report' | 'feature_request' | 'general_feedback'
          title?: string
          description?: string
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          category?: string | null
          attachments?: string[] | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
          admin_notes?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string // uuid (same as user id)
          user_id: string // uuid reference to users
          goal: 'weight-loss' | 'muscle-building' | 'strength' | 'calisthenics-mastery' | 'general-fitness' | null
          experience_level: 'beginner' | 'intermediate' | 'advanced' | null
          equipment: string[] | null
          current_program: string | null
          date_joined: string
          last_workout_date: string | null
          last_check_in_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal?: 'weight-loss' | 'muscle-building' | 'strength' | 'calisthenics-mastery' | 'general-fitness' | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          equipment?: string[] | null
          current_program?: string | null
          date_joined?: string
          last_workout_date?: string | null
          last_check_in_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal?: 'weight-loss' | 'muscle-building' | 'strength' | 'calisthenics-mastery' | 'general-fitness' | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          equipment?: string[] | null
          current_program?: string | null
          date_joined?: string
          last_workout_date?: string | null
          last_check_in_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'user'
      difficulty_level: 'beginner' | 'intermediate' | 'advanced'
      workout_status: 'scheduled' | 'in-progress' | 'completed' | 'skipped' | 'paused'
      feedback_type: 'bug_report' | 'feature_request' | 'general_feedback'
      feedback_status: 'open' | 'in_progress' | 'resolved' | 'closed'
      priority_level: 'low' | 'medium' | 'high' | 'critical'
      meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    }
  }
}

// Helper type exports for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types for convenience
export type User = Tables<'users'>
export type Exercise = Tables<'exercises'>
export type Workout = Tables<'workouts'>
export type WorkoutExercise = Tables<'workout_exercises'>
export type WorkoutAssignment = Tables<'workout_assignments'>
export type WorkoutLog = Tables<'workout_logs'>
export type ExerciseLog = Tables<'exercise_logs'>
export type SetLog = Tables<'set_logs'>
export type NutritionLog = Tables<'nutrition_logs'>
export type NutritionTarget = Tables<'nutrition_targets'>
export type SavedMeal = Tables<'saved_meals'>
export type WeightLog = Tables<'weight_logs'>
export type CoachNote = Tables<'coach_notes'>
export type Feedback = Tables<'feedback'>
export type UserProfile = Tables<'user_profiles'>
