import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Info,
  TrendingUp,
  Zap
} from 'lucide-react';
import { WorkoutSession } from '@/types/exercise';

interface MuscleRecoveryTrackerProps {
  workoutHistory: WorkoutSession[];
  onMuscleClick?: (muscleGroup: string) => void;
}

interface MuscleRecoveryStatus {
  muscleGroup: string;
  displayName: string;
  recoveryPercent: number;
  lastWorkoutDate: string | null;
  totalSets: number;
  hoursUntilRecovered: number;
  status: 'recovered' | 'partial' | 'recovering';
}

const BASE_RECOVERY_TIMES: Record<string, number> = {
  chest: 72,
  back: 72,
  legs: 72,
  quads: 72,
  hamstrings: 72,
  glutes: 72,
  shoulders: 48,
  biceps: 48,
  triceps: 48,
  forearms: 36,
  abs: 24,
  calves: 48,
  'lower back': 72,
  'full body': 72,
  core: 24,
};

const MUSCLE_GROUP_MAPPING: Record<string, string> = {
  'chest': 'chest',
  'back': 'back',
  'legs': 'legs',
  'leg': 'legs',
  'quads': 'quads',
  'quadriceps': 'quads',
  'hamstrings': 'hamstrings',
  'glutes': 'glutes',
  'glute': 'glutes',
  'shoulders': 'shoulders',
  'shoulder': 'shoulders',
  'biceps': 'biceps',
  'bicep': 'biceps',
  'triceps': 'triceps',
  'tricep': 'triceps',
  'forearms': 'forearms',
  'forearm': 'forearms',
  'abs': 'abs',
  'core': 'core',
  'calves': 'calves',
  'calf': 'calves',
  'lower back': 'lower back',
  'full body': 'full body',
};

export default function MuscleRecoveryTracker({ 
  workoutHistory, 
  onMuscleClick 
}: MuscleRecoveryTrackerProps) {
  const [recoveryData, setRecoveryData] = useState<MuscleRecoveryStatus[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    calculateRecoveryStatus();
    // Update every minute
    const interval = setInterval(calculateRecoveryStatus, 60000);
    return () => clearInterval(interval);
  }, [workoutHistory]);

  const normalizeMuscleGroup = (muscle: string): string => {
    const normalized = muscle.toLowerCase().trim();
    return MUSCLE_GROUP_MAPPING[normalized] || normalized;
  };

  const calculateRecoveryStatus = () => {
    // Get all muscle groups worked from workout history
    const muscleWorkouts: Record<string, { date: string; sets: number }[]> = {};

    workoutHistory.forEach(session => {
      if (session.status === 'completed' && session.completedAt) {
        session.exercises.forEach(exercise => {
          if (!exercise.skipped && exercise.completedSets.length > 0) {
            exercise.exercise.muscleGroups.forEach(muscle => {
              const normalizedMuscle = normalizeMuscleGroup(muscle);
              if (!muscleWorkouts[normalizedMuscle]) {
                muscleWorkouts[normalizedMuscle] = [];
              }
              muscleWorkouts[normalizedMuscle].push({
                date: session.completedAt!,
                sets: exercise.completedSets.length,
              });
            });
          }
        });
      }
    });

    // Calculate recovery for each muscle group
    const recoveryStatuses: MuscleRecoveryStatus[] = [];

    Object.entries(muscleWorkouts).forEach(([muscle, workouts]) => {
      // Sort by date (most recent first)
      workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      const lastWorkout = workouts[0];
      const baseRecoveryTime = BASE_RECOVERY_TIMES[muscle] || 48;
      
      // Calculate volume multiplier
      let volumeMultiplier = 1.0;
      if (lastWorkout.sets > 12) volumeMultiplier = 1.5;
      else if (lastWorkout.sets > 6) volumeMultiplier = 1.2;
      
      const adjustedRecoveryTime = baseRecoveryTime * volumeMultiplier;
      
      // Calculate hours since workout
      const hoursSince = (Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60);
      
      // Calculate recovery percentage
      const recoveryPercent = Math.min(100, Math.round((hoursSince / adjustedRecoveryTime) * 100));
      
      // Calculate hours until recovered
      const hoursUntilRecovered = Math.max(0, Math.round(adjustedRecoveryTime - hoursSince));
      
      // Determine status
      let status: 'recovered' | 'partial' | 'recovering';
      if (recoveryPercent >= 80) status = 'recovered';
      else if (recoveryPercent >= 50) status = 'partial';
      else status = 'recovering';
      
      recoveryStatuses.push({
        muscleGroup: muscle,
        displayName: muscle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        recoveryPercent,
        lastWorkoutDate: lastWorkout.date,
        totalSets: lastWorkout.sets,
        hoursUntilRecovered,
        status,
      });
    });

    // Sort by recovery percentage (lowest first - needs most attention)
    recoveryStatuses.sort((a, b) => a.recoveryPercent - b.recoveryPercent);

    setRecoveryData(recoveryStatuses);
  };

  const getStatusColor = (status: 'recovered' | 'partial' | 'recovering') => {
    switch (status) {
      case 'recovered':
        return 'bg-green-500';
      case 'partial':
        return 'bg-yellow-500';
      case 'recovering':
        return 'bg-red-500';
    }
  };

  const getStatusIcon = (status: 'recovered' | 'partial' | 'recovering') => {
    switch (status) {
      case 'recovered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'recovering':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const formatTimeUntilRecovered = (hours: number): string => {
    if (hours === 0) return 'Recovered';
    if (hours < 24) return `${hours}h remaining`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days}d remaining`;
    return `${days}d ${remainingHours}h remaining`;
  };

  const formatLastWorkout = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const hoursDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      const hours = Math.floor(hoursDiff);
      return `${hours}h ago`;
    }
    
    const daysDiff = Math.floor(hoursDiff / 24);
    return `${daysDiff}d ago`;
  };

  const getWorkoutRecommendations = () => {
    const recovered = recoveryData.filter(m => m.status === 'recovered');
    const partial = recoveryData.filter(m => m.status === 'partial');
    const recovering = recoveryData.filter(m => m.status === 'recovering');

    return {
      readyToTrain: recovered.map(m => m.displayName),
      lightTraining: partial.map(m => m.displayName),
      needsRest: recovering.map(m => m.displayName),
    };
  };

  const recommendations = getWorkoutRecommendations();

  if (recoveryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Muscle Recovery Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Complete some workouts to track muscle recovery</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Recovery estimates are based on typical recovery times and workout volume. 
          Individual recovery varies based on sleep, nutrition, stress, and experience level. 
          Listen to your body - these are guidelines, not medical advice.
        </AlertDescription>
      </Alert>

      {/* Workout Recommendations */}
      {showRecommendations && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <TrendingUp className="h-5 w-5" />
              Workout Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-blue-800 font-medium">Based on your recovery:</p>
            
            {recommendations.readyToTrain.length > 0 && (
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Ready to Train</p>
                  <p className="text-sm text-gray-700">
                    {recommendations.readyToTrain.join(', ')} - Fully recovered
                  </p>
                </div>
              </div>
            )}

            {recommendations.lightTraining.length > 0 && (
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Light Training OK</p>
                  <p className="text-sm text-gray-700">
                    {recommendations.lightTraining.join(', ')} - Partially recovered (avoid heavy loads)
                  </p>
                </div>
              </div>
            )}

            {recommendations.needsRest.length > 0 && (
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Needs More Rest</p>
                  <p className="text-sm text-gray-700">
                    {recommendations.needsRest.join(', ')} - Still recovering (rest recommended)
                  </p>
                </div>
              </div>
            )}

            {recommendations.readyToTrain.length > 0 && (
              <div className="mt-4 pt-3 border-t border-blue-200">
                <p className="text-sm font-medium text-blue-900">
                  💡 Recommended: Focus on {recommendations.readyToTrain[0]} today
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recovery Status List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Muscle Recovery Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recoveryData.map((muscle) => (
              <div
                key={muscle.muscleGroup}
                className={`border rounded-lg p-4 transition-all ${
                  onMuscleClick ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
                onClick={() => onMuscleClick && onMuscleClick(muscle.muscleGroup)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(muscle.status)}
                    <div>
                      <h3 className="font-semibold">{muscle.displayName}</h3>
                      <p className="text-xs text-gray-600">
                        {formatLastWorkout(muscle.lastWorkoutDate!)} • {muscle.totalSets} sets
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={`${
                        muscle.status === 'recovered'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : muscle.status === 'partial'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {muscle.recoveryPercent}%
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress
                    value={muscle.recoveryPercent}
                    className="h-2"
                    style={{
                      // @ts-ignore
                      '--progress-background': muscle.status === 'recovered'
                        ? '#22c55e'
                        : muscle.status === 'partial'
                        ? '#eab308'
                        : '#ef4444',
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{formatTimeUntilRecovered(muscle.hoursUntilRecovered)}</span>
                    <span>
                      {muscle.status === 'recovered'
                        ? '✅ Ready to train'
                        : muscle.status === 'partial'
                        ? '⚠️ Light training OK'
                        : '❌ Needs rest'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {recommendations.readyToTrain.length}
              </div>
              <div className="text-xs text-gray-600">Ready to Train</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {recommendations.lightTraining.length}
              </div>
              <div className="text-xs text-gray-600">Partial Recovery</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {recommendations.needsRest.length}
              </div>
              <div className="text-xs text-gray-600">Needs Rest</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
