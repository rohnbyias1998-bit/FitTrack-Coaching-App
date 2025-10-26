import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { WorkoutSession } from '@/types/exercise';

interface RecoveryInsightsProps {
  workoutHistory: WorkoutSession[];
}

interface MusclePattern {
  muscleGroup: string;
  averageRecoveryDays: number;
  workoutFrequency: number; // times per month
  lastWorked: string;
  recommendation: string;
}

export default function RecoveryInsights({ workoutHistory }: RecoveryInsightsProps) {
  const calculateInsights = (): MusclePattern[] => {
    const muscleWorkouts: Record<string, string[]> = {};

    // Collect all workout dates for each muscle group
    workoutHistory.forEach(session => {
      if (session.status === 'completed' && session.completedAt) {
        session.exercises.forEach(exercise => {
          if (!exercise.skipped) {
            exercise.exercise.muscleGroups.forEach(muscle => {
              const normalized = muscle.toLowerCase();
              if (!muscleWorkouts[normalized]) {
                muscleWorkouts[normalized] = [];
              }
              muscleWorkouts[normalized].push(session.completedAt!);
            });
          }
        });
      }
    });

    // Calculate patterns
    const patterns: MusclePattern[] = [];

    Object.entries(muscleWorkouts).forEach(([muscle, dates]) => {
      if (dates.length < 2) return;

      // Sort dates
      const sortedDates = dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      // Calculate average days between workouts
      let totalDays = 0;
      for (let i = 1; i < sortedDates.length; i++) {
        const daysDiff = (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / (1000 * 60 * 60 * 24);
        totalDays += daysDiff;
      }
      const averageRecoveryDays = Math.round(totalDays / (sortedDates.length - 1));

      // Calculate frequency (workouts per month)
      const firstDate = new Date(sortedDates[0]);
      const lastDate = new Date(sortedDates[sortedDates.length - 1]);
      const monthsDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      const workoutFrequency = monthsDiff > 0 ? Math.round(dates.length / monthsDiff) : dates.length;

      // Generate recommendation
      let recommendation = '';
      if (averageRecoveryDays < 2) {
        recommendation = '⚠️ Training very frequently - ensure adequate recovery';
      } else if (averageRecoveryDays > 7) {
        recommendation = '💡 Could increase training frequency for better gains';
      } else {
        recommendation = '✅ Good training frequency';
      }

      patterns.push({
        muscleGroup: muscle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        averageRecoveryDays,
        workoutFrequency,
        lastWorked: sortedDates[sortedDates.length - 1],
        recommendation,
      });
    });

    return patterns.sort((a, b) => a.averageRecoveryDays - b.averageRecoveryDays);
  };

  const insights = calculateInsights();

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recovery Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">
            Complete more workouts to see recovery patterns and insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recovery Patterns & Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((pattern) => (
            <div key={pattern.muscleGroup} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{pattern.muscleGroup}</h3>
                  <p className="text-sm text-gray-600">
                    Trained {pattern.workoutFrequency}× per month
                  </p>
                </div>
                <Badge variant="outline" className="bg-blue-50">
                  {pattern.averageRecoveryDays}d avg
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                {pattern.recommendation.includes('⚠️') ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                ) : pattern.recommendation.includes('✅') ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-600" />
                )}
                <span className="text-gray-700">{pattern.recommendation}</span>
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                <p>
                  <strong>Your pattern:</strong> You typically need {pattern.averageRecoveryDays} days 
                  between {pattern.muscleGroup.toLowerCase()} workouts
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* General Recommendations */}
        <div className="mt-6 pt-6 border-t space-y-3">
          <h4 className="font-semibold text-sm">💡 General Recommendations</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Large muscle groups (chest, back, legs) typically need 48-72 hours recovery</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Smaller muscles (biceps, triceps, shoulders) recover in 24-48 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Core muscles can be trained more frequently (24-36 hours)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Adjust based on workout intensity, sleep quality, and nutrition</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
