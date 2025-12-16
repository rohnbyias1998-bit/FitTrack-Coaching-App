/**
 * NUTRITION TYPES
 * All nutrition-related types for the FitTrack app
 *
 * These types use snake_case to match the database schema
 * Import from types/supabase.ts for auto-generated types
 */

import { Tables, TablesInsert, TablesUpdate } from './supabase'

// Re-export database types for nutrition
export type NutritionLog = Tables<'nutrition_logs'>
export type NutritionLogInsert = TablesInsert<'nutrition_logs'>
export type NutritionLogUpdate = TablesUpdate<'nutrition_logs'>

export type NutritionTarget = Tables<'nutrition_targets'>
export type NutritionTargetInsert = TablesInsert<'nutrition_targets'>
export type NutritionTargetUpdate = TablesUpdate<'nutrition_targets'>

export type SavedMeal = Tables<'saved_meals'>
export type SavedMealInsert = TablesInsert<'saved_meals'>
export type SavedMealUpdate = TablesUpdate<'saved_meals'>

export type WeightLog = Tables<'weight_logs'>
export type WeightLogInsert = TablesInsert<'weight_logs'>
export type WeightLogUpdate = TablesUpdate<'weight_logs'>

// Extended types for UI components

export interface FoodItem {
  food_name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving_size?: string
}

export interface MealWithFoods extends SavedMeal {
  foods_array: FoodItem[]
}

export interface DailyNutritionSummary {
  date: string
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  logs_count: number
  target?: NutritionTarget
  remaining_calories: number
  remaining_protein: number
  remaining_carbs: number
  remaining_fat: number
}

export interface NutritionWeekSummary {
  week_start: string
  week_end: string
  daily_summaries: DailyNutritionSummary[]
  weekly_avg_calories: number
  weekly_avg_protein: number
  weekly_avg_carbs: number
  weekly_avg_fat: number
  days_tracked: number
}

export interface WeightProgress {
  user_id: string
  logs: WeightLog[]
  current_weight: number | null
  starting_weight: number | null
  weight_change: number
  weight_change_percentage: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

// USDA API related types
export interface USDAFood {
  fdcId: number
  description: string
  dataType: string
  foodNutrients: USDANutrient[]
  servingSize?: number
  servingSizeUnit?: string
  brandOwner?: string
  brandName?: string
}

export interface USDANutrient {
  nutrientId: number
  nutrientName: string
  nutrientNumber: string
  unitName: string
  value: number
}

export interface USDASearchResponse {
  totalHits: number
  currentPage: number
  totalPages: number
  foods: USDAFood[]
}

export interface USDASearchRequest {
  query: string
  pageSize?: number
  pageNumber?: number
  dataType?: string[]
}

// Helper type for nutrition log form
export interface NutritionLogFormData {
  food_name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving_size?: string
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  date?: string
  notes?: string
}

// Helper type for saved meal form
export interface SavedMealFormData {
  meal_name: string
  foods: FoodItem[]
}

// Helper type for weight log form
export interface WeightLogFormData {
  weight: number
  date?: string
  notes?: string
}

// Nutrition target form
export interface NutritionTargetFormData {
  target_calories: number
  target_protein: number
  target_carbs: number
  target_fat: number
  start_date?: string
  end_date?: string
  notes?: string
}
