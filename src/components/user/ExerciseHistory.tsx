import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Flame,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { Exercise, WorkoutSession, ExerciseLog, SetLog } from '@/types/exercise';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExerciseHistoryProps {
  exercise: Exercise;
  workoutHistory: WorkoutSession[];
  onBack: () => void;
}

interface PersonalRecords {
  mostWeight: { weight: number; reps: number; date: string };
  mostReps: { weight: number; reps: number; date: string };
  highestVolume: { volume: number; date: string; workoutName: string };
  bestSet: { weight: number; reps: number; date: string };
  longestStreak: { weeks: number; startDate: string; endDate: string };
  estimated1RM: number;
}

interface ExercisePerformance {
  date: string;
  workoutName: string;
  sets: SetLog[];
  totalVolume: number;
  maxWeight: number;
  avgReps: number;
  notes?: string;
}

export default function ExerciseHistory({ exercise, workoutHistory, onBack }: ExerciseHistoryProps) {
  const [chartView, setChartView] = useState<'weight' | 'reps' | 'volume'>('weight');
  const [timeRange, setTimeRange] = useState<'month' | '3months' | 'all'>('3months');

  // Calculate 1RM using Epley formula
  const estimate1RM = (weight: number, reps: number): number => {
    if (reps === 1) return weight;
    return weight * (1 + reps / 30);
  };

  // Calculate volume for a set of sets
  const calculateVolume = (sets: SetLog[]): number => {
    return sets.reduce((total, set) => {
      return total + ((set.reps || 0) * (set.weight || 0));
    }, 0);
  };

  // Get all performances for this exercise
  const getExercisePerformances = (): ExercisePerformance[] => {
    const performances: ExercisePerformance[] = [];
    
    workoutHistory.forEach(session => {
      const exerciseLog = session.exercises.find(ex => ex.exerciseId === exercise.id);
      if (exerciseLog && !exerciseLog.skipped && exerciseLog.completedSets.length > 0) {
        const sets = exerciseLog.completedSets;
        const totalVolume = calculateVolume(sets);
        const maxWeight = Math.max(...sets.map(s => s.weight || 0));
        const avgReps = sets.reduce((sum, s) => sum + (s.reps || 0), 0) / sets.length;
        
        performances.push({
          date: session.completedAt || session.startedAt,
          workoutName: 'Workout', // Would come from workout plan
          sets,
          totalVolume,
          maxWeight,
          avgReps,
          notes: exerciseLog.notes,
        });
      }
    });
    
    return performances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Calculate personal records
  const calculatePersonalRecords = (): PersonalRecords => {
    const performances = getExercisePerformances();
    
    let mostWeight = { weight: 0, reps: 0, date: '' };
    let mostReps = { weight: 0, reps: 0, date: '' };
    let highestVolume = { volume: 0, date: '', workoutName: '' };
    let bestSet = { weight: 0, reps: 0, date: '' };
    let estimated1RM = 0;
    
    performances.forEach(perf => {
      // Most weight
      const heaviestSet = perf.sets.reduce((max, set) => 
        (set.weight || 0) > (max.weight || 0) ? set : max
      );
      if ((heaviestSet.weight || 0) > mostWeight.weight) {
        mostWeight = {
          weight: heaviestSet.weight || 0,
          reps: heaviestSet.reps || 0,
          date: perf.date,
        };
      }
      
      // Most reps
      const mostRepsSet = perf.sets.reduce((max, set) => 
        (set.reps || 0) > (max.reps || 0) ? set : max
      );
      if ((mostRepsSet.reps || 0) > mostReps.reps) {
        mostReps = {
          weight: mostRepsSet.weight || 0,
          reps: mostRepsSet.reps || 0,
          date: perf.date,
        };
      }
      
      // Highest volume
      if (perf.totalVolume > highestVolume.volume) {
        highestVolume = {
          volume: perf.totalVolume,
          date: perf.date,
          workoutName: perf.workoutName,
        };
      }
      
      // Best set (weight × reps)
      perf.sets.forEach(set => {
        const setScore = (set.weight || 0) * (set.reps || 0);
        const bestScore = bestSet.weight * bestSet.reps;
        if (setScore > bestScore) {
          bestSet = {
            weight: set.weight || 0,
            reps: set.reps || 0,
            date: perf.date,
          };
        }
      });
      
      // Estimated 1RM
      perf.sets.forEach(set => {
        if (set.weight && set.reps) {
          const est = estimate1RM(set.weight, set.reps);
          if (est > estimated1RM) {
            estimated1RM = est;
          }
        }
      });
    });
    
    // Calculate streak (simplified - would need more complex logic)
    const longestStreak = {
      weeks: Math.floor(performances.length / 2), // Mock calculation
      startDate: performances[performances.length - 1]?.date || '',
      endDate: performances[0]?.date || '',
    };
    
    return {
      mostWeight,
      mostReps,
      highestVolume,
      bestSet,
      longestStreak,
      estimated1RM: Math.round(estimated1RM),
    };
  };

  // Prepare chart data
  const getChartData = () => {
    const performances = getExercisePerformances();
    
    // Filter by time range
    const now = new Date();
    const filtered = performances.filter(perf => {
      const perfDate = new Date(perf.date);
      const daysDiff = (now.getTime() - perfDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (timeRange === 'month') return daysDiff <= 30;
      if (timeRange === '3months') return daysDiff <= 90;
      return true;
    });
    
    return filtered.reverse().map(perf => ({
      date: new Date(perf.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: perf.maxWeight,
      reps: Math.round(perf.avgReps),
      volume: perf.totalVolume,
    }));
  };

  // Calculate trend
  const calculateTrend = () => {
    const performances = getExercisePerformances();
    if (performances.length < 2) return null;
    
    const recent = performances.slice(0, Math.min(4, performances.length));
    const older = performances.slice(Math.min(4, performances.length), Math.min(8, performances.length));
    
    if (older.length === 0) return null;
    
    const recentAvg = recent.reduce((sum, p) => sum + p.maxWeight, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p.maxWeight, 0) / older.length;
    
    const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    return {
      direction: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable',
      percentage: Math.abs(Math.round(percentChange)),
      message: percentChange > 5 
        ? `📈 Up ${Math.round(percentChange)}% in strength over last month`
        : percentChange < -5
        ? `⚠️ Down ${Math.abs(Math.round(percentChange))}% - consider changing approach`
        : '➡️ Maintaining current strength levels',
    };
  };

  const performances = getExercisePerformances();
  const prs = calculatePersonalRecords();
  const chartData = getChartData();
  const trend = calculateTrend();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Workouts
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{exercise.name} History</h1>
        <p className="text-gray-600">{exercise.muscleGroups.join(', ')}</p>
      </div>

      {/* Personal Records */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-purple-600" />
                <p className="text-sm font-medium text-gray-600">Most Weight</p>
              </div>
              <p className="text-2xl font-bold">{prs.mostWeight.weight} lbs</p>
              <p className="text-sm text-gray-600">× {prs.mostWeight.reps} reps</p>
              {prs.mostWeight.date && (
                <p className="text-xs text-gray-500 mt-1">{formatDate(prs.mostWeight.date)}</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-medium text-gray-600">Most Reps</p>
              </div>
              <p className="text-2xl font-bold">{prs.mostReps.reps} reps</p>
              <p className="text-sm text-gray-600">@ {prs.mostReps.weight} lbs</p>
              {prs.mostReps.date && (
                <p className="text-xs text-gray-500 mt-1">{formatDate(prs.mostReps.date)}</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-gray-600">Best Volume</p>
              </div>
              <p className="text-2xl font-bold">{prs.highestVolume.volume.toLocaleString()} lbs</p>
              {prs.highestVolume.date && (
                <p className="text-xs text-gray-500 mt-1">{formatDate(prs.highestVolume.date)}</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-orange-600" />
                <p className="text-sm font-medium text-gray-600">Estimated 1RM</p>
              </div>
              <p className="text-2xl font-bold">{prs.estimated1RM} lbs</p>
              <p className="text-xs text-gray-500 mt-1">Based on best set</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium text-gray-600">Consistency</p>
              </div>
              <p className="text-2xl font-bold">{prs.longestStreak.weeks} weeks</p>
              <p className="text-xs text-gray-500 mt-1">Longest streak</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <p className="text-sm font-medium text-gray-600">Frequency</p>
              </div>
              <p className="text-2xl font-bold">{performances.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total workouts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Insights */}
      {trend && (
        <Card className={`border-2 ${
          trend.direction === 'up' ? 'border-green-200 bg-green-50' :
          trend.direction === 'down' ? 'border-red-200 bg-red-50' :
          'border-blue-200 bg-blue-50'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {trend.direction === 'up' ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : trend.direction === 'down' ? (
                <TrendingDown className="h-8 w-8 text-red-600" />
              ) : (
                <BarChart3 className="h-8 w-8 text-blue-600" />
              )}
              <div>
                <p className="font-semibold text-lg">{trend.message}</p>
                <p className="text-sm text-gray-600">
                  Performed {performances.length} times in last {timeRange === 'month' ? '30 days' : timeRange === '3months' ? '3 months' : 'all time'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progress Chart
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={timeRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('month')}
              >
                1M
              </Button>
              <Button
                variant={timeRange === '3months' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('3months')}
              >
                3M
              </Button>
              <Button
                variant={timeRange === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('all')}
              >
                All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={chartView} onValueChange={(v) => setChartView(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="reps">Reps</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>

            <TabsContent value="weight">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Max Weight (lbs)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="reps">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="reps" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Avg Reps"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="volume">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    name="Total Volume (lbs)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Workout History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Workout History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performances.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No workout history for this exercise yet
              </p>
            ) : (
              performances.map((perf, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{formatDate(perf.date)}</p>
                      <p className="text-sm text-gray-600">{perf.workoutName}</p>
                    </div>
                    <Badge variant="outline">
                      {perf.sets.length} sets
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {perf.sets.map((set, setIndex) => (
                      <span key={setIndex} className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {set.weight}×{set.reps}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Volume: {perf.totalVolume.toLocaleString()} lbs</span>
                    <span>Max: {perf.maxWeight} lbs</span>
                    <span>Avg Reps: {Math.round(perf.avgReps)}</span>
                  </div>
                  
                  {perf.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      "{perf.notes}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
