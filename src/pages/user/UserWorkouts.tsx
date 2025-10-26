import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Activity, CheckCircle, Dumbbell } from 'lucide-react';
import ActiveWorkoutSession from '@/components/user/ActiveWorkoutSession';
import ExerciseHistory from '@/components/user/ExerciseHistory';
import { WorkoutPlan, WorkoutSession, Exercise } from '@/types/exercise';

interface WorkoutData {
  id: string;
  name: string;
  assignedBy: string;
  date: string;
  duration: string;
  exercises: number;
  completed: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: string;
}

export default function UserWorkouts() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [activeWorkout, setActiveWorkout] = useState<WorkoutPlan | null>(null);
  const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null);
  const [completedSessions, setCompletedSessions] = useState<WorkoutSession[]>([]);

  // Mock workout plans
  const mockWorkoutPlans: WorkoutPlan[] = [
    {
      id: 'wp-1',
      name: 'Morning Cardio Blast',
      description: 'High-intensity cardio workout to start your day',
      exercises: [
        {
          exerciseId: '1',
          exercise: {
            id: '1',
            name: 'Jumping Jacks',
            description: 'Full body cardio exercise',
            type: 'cardio',
            difficulty: 'beginner',
            muscleGroups: ['Full Body', 'Cardio'],
            equipment: ['bodyweight'],
            instructions: ['Stand with feet together', 'Jump while spreading legs and raising arms'],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          sets: 3,
          duration: 60,
          restTime: 30,
          order: 1,
        },
        {
          exerciseId: '2',
          exercise: {
            id: '2',
            name: 'Burpees',
            description: 'Full-body high-intensity exercise',
            type: 'hiit',
            difficulty: 'advanced',
            muscleGroups: ['Full Body', 'Cardio'],
            equipment: ['bodyweight'],
            instructions: ['Start standing', 'Drop to squat', 'Jump back to plank', 'Return to standing'],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          sets: 3,
          reps: 10,
          restTime: 90,
          order: 2,
        },
        {
          exerciseId: '3',
          exercise: {
            id: '3',
            name: 'Mountain Climbers',
            description: 'Core and cardio exercise',
            type: 'cardio',
            difficulty: 'intermediate',
            muscleGroups: ['Core', 'Cardio'],
            equipment: ['bodyweight'],
            instructions: ['Start in plank position', 'Alternate bringing knees to chest'],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          sets: 3,
          duration: 45,
          restTime: 60,
          order: 3,
        },
      ],
      totalDuration: 45,
      difficulty: 'intermediate',
      type: 'Cardio',
      createdBy: 'Coach Sarah',
      createdAt: '2024-01-01',
    },
    {
      id: 'wp-2',
      name: 'Upper Body Strength',
      description: 'Build upper body strength and muscle',
      exercises: [
        {
          exerciseId: '4',
          exercise: {
            id: '4',
            name: 'Bench Press',
            description: 'Classic chest exercise',
            type: 'strength',
            difficulty: 'intermediate',
            muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
            equipment: ['barbell', 'bench'],
            instructions: ['Lie on bench', 'Lower bar to chest', 'Press up'],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          sets: 4,
          reps: 10,
          restTime: 120,
          order: 1,
        },
        {
          exerciseId: '5',
          exercise: {
            id: '5',
            name: 'Pull-ups',
            description: 'Back and bicep exercise',
            type: 'strength',
            difficulty: 'advanced',
            muscleGroups: ['Back', 'Biceps'],
            equipment: ['pull-up-bar'],
            instructions: ['Hang from bar', 'Pull chin over bar', 'Lower with control'],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          sets: 4,
          reps: 8,
          restTime: 120,
          order: 2,
        },
        {
          exerciseId: '6',
          exercise: {
            id: '6',
            name: 'Overhead Press',
            description: 'Shoulder strength exercise',
            type: 'strength',
            difficulty: 'intermediate',
            muscleGroups: ['Shoulders', 'Triceps'],
            equipment: ['barbell'],
            instructions: ['Start at shoulders', 'Press overhead', 'Lower with control'],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          sets: 3,
          reps: 10,
          restTime: 90,
          order: 3,
        },
      ],
      totalDuration: 60,
      difficulty: 'advanced',
      type: 'Strength',
      createdBy: 'Coach Mike',
      createdAt: '2024-01-01',
    },
  ];

  const assignedWorkouts: WorkoutData[] = [
    {
      id: '1',
      name: 'Morning Cardio Blast',
      assignedBy: 'Coach Sarah',
      date: 'Today, 6:00 AM',
      duration: '45 min',
      exercises: 5,
      completed: false,
      difficulty: 'intermediate',
      type: 'Cardio',
    },
    {
      id: '2',
      name: 'Upper Body Strength',
      assignedBy: 'Coach Mike',
      date: 'Tomorrow, 5:30 PM',
      duration: '60 min',
      exercises: 8,
      completed: false,
      difficulty: 'advanced',
      type: 'Strength',
    },
    {
      id: '3',
      name: 'Leg Day Challenge',
      assignedBy: 'Coach Sarah',
      date: 'Wed, 6:00 PM',
      duration: '50 min',
      exercises: 6,
      completed: false,
      difficulty: 'intermediate',
      type: 'Strength',
    },
    {
      id: '4',
      name: 'Flexibility & Recovery',
      assignedBy: 'Coach Lisa',
      date: 'Thu, 7:00 AM',
      duration: '30 min',
      exercises: 4,
      completed: false,
      difficulty: 'beginner',
      type: 'Recovery',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredWorkouts = assignedWorkouts.filter(workout => {
    if (filter === 'completed') return workout.completed;
    if (filter === 'upcoming') return !workout.completed;
    return true;
  });

  const handleStartWorkout = (workout: WorkoutData) => {
    // Find matching workout plan
    const plan = mockWorkoutPlans.find(p => p.name === workout.name);
    if (plan) {
      setActiveWorkout(plan);
    }
  };

  const handleCompleteWorkout = (session: WorkoutSession) => {
    console.log('Workout completed:', session);
    setCompletedSessions(prev => [...prev, session]);
    setActiveWorkout(null);
  };

  const handleCancelWorkout = () => {
    setActiveWorkout(null);
  };

  const handleViewExerciseHistory = (exercise: Exercise) => {
    setViewingExercise(exercise);
  };

  // If viewing exercise history
  if (viewingExercise) {
    return (
      <ExerciseHistory
        exercise={viewingExercise}
        workoutHistory={completedSessions}
        onBack={() => setViewingExercise(null)}
      />
    );
  }

  // If active workout, show the workout session
  if (activeWorkout) {
    return (
      <ActiveWorkoutSession
        workoutPlan={activeWorkout}
        onComplete={handleCompleteWorkout}
        onCancel={handleCancelWorkout}
        onViewExerciseHistory={(exerciseId) => {
          const exercise = activeWorkout.exercises.find(e => e.exerciseId === exerciseId)?.exercise;
          if (exercise) {
            handleViewExerciseHistory(exercise);
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Workouts
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>

      {/* Workouts List */}
      <div className="space-y-4">
        {filteredWorkouts.map((workout) => (
          <Card key={workout.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {workout.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Clock className="h-6 w-6 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{workout.name}</h3>
                    <p className="text-sm text-gray-600">
                      Assigned by {workout.assignedBy}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{workout.type}</Badge>
                  <Badge className={getDifficultyColor(workout.difficulty)}>
                    {workout.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {workout.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {workout.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  {workout.exercises} exercises
                </span>
              </div>

              <div className="mt-4">
                <Button
                  size="sm"
                  variant={workout.completed ? 'outline' : 'default'}
                  disabled={workout.completed}
                  onClick={() => !workout.completed && handleStartWorkout(workout)}
                >
                  {workout.completed ? 'View Details' : 'Start Workout'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredWorkouts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
              <p className="text-gray-600">
                {filter === 'completed' 
                  ? "You haven't completed any workouts yet."
                  : "No upcoming workouts scheduled."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}