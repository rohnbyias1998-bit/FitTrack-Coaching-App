import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutSession } from '@/types/exercise';

interface WeeklyMuscleHeatmapProps {
  workoutHistory: WorkoutSession[];
}

interface DayActivation {
  day: string;
  date: string;
  muscles: Record<string, number>; // muscle -> activation level
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'abs'];

export default function WeeklyMuscleHeatmap({ workoutHistory }: WeeklyMuscleHeatmapProps) {
  const getWeekData = (): DayActivation[] => {
    const today = new Date();
    const weekData: DayActivation[] = [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const dateStr = date.toISOString().split('T')[0];
      
      const muscles: Record<string, number> = {};
      
      // Find workouts for this day
      const dayWorkouts = workoutHistory.filter(session => {
        const sessionDate = new Date(session.completedAt || session.startedAt).toISOString().split('T')[0];
        return sessionDate === dateStr && session.status === 'completed';
      });
      
      // Calculate muscle activation for this day
      dayWorkouts.forEach(session => {
        session.exercises.forEach(exercise => {
          if (!exercise.skipped && exercise.completedSets.length > 0) {
            exercise.exercise.muscleGroups.forEach(muscle => {
              const normalized = muscle.toLowerCase();
              const sets = exercise.completedSets.length;
              const activation = Math.min(100, sets * 20);
              
              if (!muscles[normalized]) {
                muscles[normalized] = 0;
              }
              muscles[normalized] = Math.min(100, muscles[normalized] + activation);
            });
          }
        });
      });
      
      weekData.push({
        day: dayName,
        date: dateStr,
        muscles,
      });
    }
    
    return weekData;
  };

  const weekData = getWeekData();

  const getActivationColor = (activation: number): string => {
    if (activation === 0) return 'bg-gray-100';
    if (activation < 40) return 'bg-yellow-200';
    if (activation < 70) return 'bg-orange-300';
    return 'bg-red-400';
  };

  const getActivationLabel = (activation: number): string => {
    if (activation === 0) return 'Rest';
    if (activation < 40) return 'Light';
    if (activation < 70) return 'Moderate';
    return 'Heavy';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week's Muscle Activation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b font-medium text-sm">Muscle</th>
                {weekData.map((day) => (
                  <th key={day.date} className="text-center p-2 border-b font-medium text-sm">
                    {day.day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MUSCLE_GROUPS.map((muscle) => (
                <tr key={muscle} className="border-b">
                  <td className="p-2 font-medium text-sm capitalize">{muscle}</td>
                  {weekData.map((day) => {
                    const activation = day.muscles[muscle] || 0;
                    return (
                      <td key={day.date} className="p-2">
                        <div
                          className={`h-8 rounded ${getActivationColor(activation)} flex items-center justify-center text-xs font-medium transition-all hover:scale-105 cursor-pointer`}
                          title={`${muscle} - ${day.day}: ${getActivationLabel(activation)} (${activation}%)`}
                        >
                          {activation > 0 && (
                            <span className="text-gray-700">{Math.round(activation)}%</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400" />
            <span>Heavy (70-100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-300" />
            <span>Moderate (40-69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-200" />
            <span>Light (1-39%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100" />
            <span>Rest (0%)</span>
          </div>
        </div>

        {/* Training Balance Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">💡 Training Balance</h4>
          <p className="text-sm text-gray-700">
            {getTrainingBalanceInsight(weekData)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getTrainingBalanceInsight(weekData: DayActivation[]): string {
  const muscleFrequency: Record<string, number> = {};
  
  weekData.forEach(day => {
    Object.keys(day.muscles).forEach(muscle => {
      if (day.muscles[muscle] > 0) {
        muscleFrequency[muscle] = (muscleFrequency[muscle] || 0) + 1;
      }
    });
  });

  const mostTrained = Object.entries(muscleFrequency)
    .sort((a, b) => b[1] - a[1])[0];
  
  const leastTrained = MUSCLE_GROUPS.filter(m => !muscleFrequency[m] || muscleFrequency[m] === 0);

  if (leastTrained.length > 0) {
    return `You haven't trained ${leastTrained.join(', ')} this week. Consider adding exercises for balanced development.`;
  }

  if (mostTrained && mostTrained[1] > 3) {
    return `${mostTrained[0]} has been trained ${mostTrained[1]} times this week. Ensure adequate recovery between sessions.`;
  }

  return "Great balance! You're training all major muscle groups this week.";
}