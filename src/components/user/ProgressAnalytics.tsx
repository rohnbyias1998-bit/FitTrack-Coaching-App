import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Trophy,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
} from 'lucide-react';
import { WorkoutSession } from '@/types/exercise';

interface ProgressAnalyticsProps {
  workoutHistory: WorkoutSession[];
}

type TimePeriod = '7days' | '30days' | '3months' | '6months' | '1year' | 'all';

interface StrengthTrend {
  exercise: string;
  data: { date: string; weight: number }[];
  change: number;
  changePercent: number;
}

interface VolumeData {
  week: string;
  volume: number;
}

interface ConsistencyData {
  currentStreak: number;
  workoutsThisMonth: number;
  completionRate: number;
  mostActiveDay: string;
  avgWorkoutsPerWeek: number;
}

interface BodyMetric {
  date: string;
  weight: number;
}

interface Goal {
  id: string;
  type: 'strength' | 'skill' | 'bodyweight' | 'consistency';
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string | null;
  progress: number;
}

export default function ProgressAnalytics({ workoutHistory }: ProgressAnalyticsProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30days');

  // Filter workouts by time period
  const getFilteredWorkouts = () => {
    const now = new Date();
    const filtered = workoutHistory.filter(session => {
      const sessionDate = new Date(session.completedAt || session.startedAt);
      const daysDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);

      switch (timePeriod) {
        case '7days':
          return daysDiff <= 7;
        case '30days':
          return daysDiff <= 30;
        case '3months':
          return daysDiff <= 90;
        case '6months':
          return daysDiff <= 180;
        case '1year':
          return daysDiff <= 365;
        default:
          return true;
      }
    });

    return filtered.filter(s => s.status === 'completed');
  };

  // Calculate strength trends for key exercises
  const calculateStrengthTrends = (): StrengthTrend[] => {
    const keyExercises = ['bench press', 'squat', 'deadlift', 'overhead press'];
    const trends: StrengthTrend[] = [];

    keyExercises.forEach(exerciseName => {
      const exerciseData: { date: string; weight: number }[] = [];

      getFilteredWorkouts().forEach(session => {
        session.exercises.forEach(ex => {
          if (ex.exercise.name.toLowerCase().includes(exerciseName) && !ex.skipped) {
            const maxWeight = Math.max(...ex.completedSets.map(s => s.weight || 0));
            if (maxWeight > 0) {
              exerciseData.push({
                date: new Date(session.completedAt!).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                }),
                weight: maxWeight,
              });
            }
          }
        });
      });

      if (exerciseData.length >= 2) {
        const firstWeight = exerciseData[0].weight;
        const lastWeight = exerciseData[exerciseData.length - 1].weight;
        const change = lastWeight - firstWeight;
        const changePercent = (change / firstWeight) * 100;

        trends.push({
          exercise: exerciseName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          data: exerciseData,
          change,
          changePercent,
        });
      }
    });

    return trends;
  };

  // Calculate weekly volume
  const calculateWeeklyVolume = (): VolumeData[] => {
    const weeklyData: Record<string, number> = {};

    getFilteredWorkouts().forEach(session => {
      const weekStart = getWeekStart(new Date(session.completedAt!));
      const weekKey = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      let sessionVolume = 0;
      session.exercises.forEach(ex => {
        ex.completedSets.forEach(set => {
          if (set.weight && set.reps) {
            sessionVolume += set.weight * set.reps;
          }
        });
      });

      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + sessionVolume;
    });

    return Object.entries(weeklyData).map(([week, volume]) => ({
      week,
      volume,
    }));
  };

  // Calculate consistency metrics
  const calculateConsistency = (): ConsistencyData => {
    const workouts = getFilteredWorkouts();
    const now = new Date();

    // Current streak
    let currentStreak = 0;
    const sortedWorkouts = [...workouts].sort(
      (a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    );

    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].completedAt!);
      const daysDiff = (now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff <= i + 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Workouts this month
    const thisMonth = workouts.filter(w => {
      const workoutDate = new Date(w.completedAt!);
      return workoutDate.getMonth() === now.getMonth() && workoutDate.getFullYear() === now.getFullYear();
    }).length;

    // Most active day
    const dayCount: Record<string, number> = {};
    workouts.forEach(w => {
      const day = new Date(w.completedAt!).toLocaleDateString('en-US', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Average workouts per week
    const weeks = Math.ceil(
      (now.getTime() - new Date(workouts[workouts.length - 1]?.completedAt || now).getTime()) /
        (1000 * 60 * 60 * 24 * 7)
    );
    const avgWorkoutsPerWeek = weeks > 0 ? Math.round(workouts.length / weeks) : 0;

    return {
      currentStreak,
      workoutsThisMonth: thisMonth,
      completionRate: 93, // Mock - would calculate from assigned vs completed
      mostActiveDay,
      avgWorkoutsPerWeek,
    };
  };

  // Mock body metrics (would come from health logs)
  const bodyMetrics: BodyMetric[] = [
    { date: 'Jan 1', weight: 188 },
    { date: 'Jan 8', weight: 187 },
    { date: 'Jan 15', weight: 186 },
    { date: 'Jan 22', weight: 185 },
    { date: 'Jan 29', weight: 185 },
  ];

  // Mock goals
  const goals: Goal[] = [
    {
      id: '1',
      type: 'strength',
      title: 'Bench Press 225 lbs',
      target: 225,
      current: 180,
      unit: 'lbs',
      deadline: '2024-03-01',
      progress: 80,
    },
    {
      id: '2',
      type: 'skill',
      title: '10 Pull-ups',
      target: 10,
      current: 6,
      unit: 'reps',
      deadline: '2024-02-15',
      progress: 60,
    },
    {
      id: '3',
      type: 'bodyweight',
      title: 'Lose 10 lbs',
      target: 180,
      current: 185,
      unit: 'lbs',
      deadline: '2024-04-01',
      progress: 50,
    },
  ];

  // Generate insights
  const generateInsights = () => {
    const insights: { type: 'positive' | 'warning'; message: string }[] = [];
    const strengthTrends = calculateStrengthTrends();
    const consistency = calculateConsistency();
    const volumeData = calculateWeeklyVolume();

    // Strength insights
    strengthTrends.forEach(trend => {
      if (trend.changePercent > 10) {
        insights.push({
          type: 'positive',
          message: `🎉 ${trend.exercise} increased ${Math.round(trend.changePercent)}% (${trend.change > 0 ? '+' : ''}${trend.change} lbs)`,
        });
      } else if (trend.changePercent === 0 && trend.data.length >= 3) {
        insights.push({
          type: 'warning',
          message: `⚠️ ${trend.exercise} hasn't increased in ${timePeriod} - consider deload or variation`,
        });
      }
    });

    // Consistency insights
    if (consistency.currentStreak >= 7) {
      insights.push({
        type: 'positive',
        message: `🔥 ${consistency.currentStreak}-day workout streak - keep it up!`,
      });
    }

    // Volume insights
    if (volumeData.length >= 2) {
      const lastWeek = volumeData[volumeData.length - 1].volume;
      const prevWeek = volumeData[volumeData.length - 2].volume;
      const volumeChange = ((lastWeek - prevWeek) / prevWeek) * 100;

      if (volumeChange > 15) {
        insights.push({
          type: 'positive',
          message: `📈 Volume increased ${Math.round(volumeChange)}% this week`,
        });
      } else if (volumeChange < -20) {
        insights.push({
          type: 'warning',
          message: `📉 Volume dropped ${Math.abs(Math.round(volumeChange))}% - rest week or vacation?`,
        });
      }
    }

    return insights;
  };

  const strengthTrends = calculateStrengthTrends();
  const volumeData = calculateWeeklyVolume();
  const consistency = calculateConsistency();
  const insights = generateInsights();

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Analytics</h1>
          <p className="text-gray-600">Track your fitness journey and achievements</p>
        </div>
        <div className="flex gap-2">
          <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <Card
              key={index}
              className={`border-2 ${
                insight.type === 'positive'
                  ? 'border-green-200 bg-green-50'
                  : 'border-yellow-200 bg-yellow-50'
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  {insight.type === 'positive' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  )}
                  <p className="font-medium">{insight.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Strength Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Strength Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {strengthTrends.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {strengthTrends.map((trend, index) => (
                    <Line
                      key={trend.exercise}
                      data={trend.data}
                      type="monotone"
                      dataKey="weight"
                      stroke={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index]}
                      strokeWidth={2}
                      name={trend.exercise}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {strengthTrends.map((trend) => (
                  <div key={trend.exercise} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{trend.exercise}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">
                        {trend.change > 0 ? '+' : ''}
                        {trend.change} lbs
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          trend.changePercent > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }
                      >
                        {trend.changePercent > 0 ? '↑' : '↓'} {Math.abs(Math.round(trend.changePercent))}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Complete more workouts to see strength trends</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Volume Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Volume Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {volumeData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill="#3b82f6" name="Volume (lbs)" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold">
                    {volumeData[volumeData.length - 1]?.volume.toLocaleString() || 0} lbs
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Last Week</p>
                  <p className="text-2xl font-bold">
                    {volumeData[volumeData.length - 2]?.volume.toLocaleString() || 0} lbs
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Average</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      volumeData.reduce((sum, d) => sum + d.volume, 0) / volumeData.length
                    ).toLocaleString()}{' '}
                    lbs
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Complete more workouts to track volume</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consistency & Body Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consistency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Flame className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{consistency.currentStreak}</p>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{consistency.workoutsThisMonth}</p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-semibold">{consistency.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Most Active Day</span>
                  <span className="font-semibold">{consistency.mostActiveDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Workouts/Week</span>
                  <span className="font-semibold">{consistency.avgWorkoutsPerWeek}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Body Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Body Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={bodyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[180, 190]} />
                <Tooltip />
                <Area type="monotone" dataKey="weight" stroke="#8b5cf6" fill="#c4b5fd" />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Current</p>
                <p className="text-xl font-bold">185 lbs</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Change</p>
                <p className="text-xl font-bold text-green-600">-3 lbs</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Goal</p>
                <p className="text-xl font-bold">180 lbs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{goal.title}</h4>
                    <p className="text-sm text-gray-600">
                      {goal.current} / {goal.target} {goal.unit}
                      {goal.deadline && ` • Due ${new Date(goal.deadline).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {goal.progress}%
                  </Badge>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
