export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: ExerciseType;
  videoUrl?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  muscleGroups: string[];
  equipment: string[];
  duration?: number; // in minutes
  instructions: string[];
  createdAt: string;
  updatedAt: string;
}

export type ExerciseType = 
  | "cardio"
  | "strength"
  | "flexibility"
  | "balance"
  | "hiit"
  | "yoga"
  | "pilates"
  | "functional"
  | "sports";

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  totalDuration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: string;
  createdBy: string;
  createdAt: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets?: number;
  reps?: number;
  duration?: number; // in seconds
  restTime?: number; // in seconds
  notes?: string;
  order: number;
}

export interface UserWorkoutAssignment {
  id: string;
  userId: number;
  workoutPlanId: string;
  assignedBy: string;
  assignedAt: string;
  scheduledDate?: string;
  status: "scheduled" | "in-progress" | "completed" | "skipped";
  notes?: string;
  completedAt?: string;
}

export interface WorkoutSession {
  id: string;
  userId: number;
  workoutPlanId: string;
  assignmentId?: string;
  startedAt: string;
  completedAt?: string;
  status: "in-progress" | "completed" | "paused";
  totalDuration?: number; // in seconds
  notes?: string;
  exercises: ExerciseLog[];
}

export interface ExerciseLog {
  id: string;
  sessionId: string;
  exerciseId: string;
  exercise: Exercise;
  plannedSets?: number;
  plannedReps?: number;
  plannedDuration?: number;
  completedSets: SetLog[];
  notes?: string;
  skipped: boolean;
  completedAt?: string;
}

export interface SetLog {
  id: string;
  setNumber: number;
  reps?: number;
  weight?: number; // in lbs
  duration?: number; // in seconds
  restTime?: number; // in seconds
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
  completedAt: string;
}

export interface WorkoutProgress {
  userId: number;
  totalWorkouts: number;
  totalDuration: number; // in minutes
  totalCaloriesBurned: number;
  averageWorkoutDuration: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
  currentStreak: number;
  longestStreak: number;
  favoriteExerciseType: ExerciseType;
  progressByWeek: WeeklyProgress[];
  milestones: Milestone[];
}

export interface WeeklyProgress {
  weekStart: string;
  weekEnd: string;
  workoutsCompleted: number;
  totalDuration: number;
  caloriesBurned: number;
  averageRpe: number;
  strengthGains: number; // percentage
  enduranceGains: number; // percentage
}

export interface Milestone {
  id: string;
  userId: number;
  type: "workout_count" | "duration" | "weight_lifted" | "streak" | "personal_record";
  title: string;
  description: string;
  value: number;
  unit: string;
  achievedAt: string;
  exerciseType?: ExerciseType;
}