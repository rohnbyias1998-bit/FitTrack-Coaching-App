import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Clock,
  Target,
  Flame,
  Zap,
  Activity,
  Weight,
  Timer,
  Trophy,
} from "lucide-react";
import {
  WorkoutProgress,
  WeeklyProgress,
  Milestone,
  WorkoutSession,
  ExerciseType,
} from "@/types/exercise";

interface ProgressDashboardProps {
  userId: number;
  workoutSessions: WorkoutSession[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  userId,
  workoutSessions,
}) => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "3months" | "year">("month");

  // Calculate progress data from workout sessions
  const calculateProgress = (): WorkoutProgress => {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const completedSessions = workoutSessions.filter(s => s.status === "completed");
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0);
    const totalCalories = completedSessions.length * 300; // Rough estimate
    
    const workoutsThisWeek = completedSessions.filter(s => 
      new Date(s.startedAt) >= weekStart
    ).length;
    
    const workoutsThisMonth = completedSessions.filter(s => 
      new Date(s.startedAt) >= monthStart
    ).length;

    // Calculate weekly progress
    const weeklyProgress: WeeklyProgress[] = [];
    for (let i = 11; i >= 0; i--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      
      const weekSessions = completedSessions.filter(s => {
        const sessionDate = new Date(s.startedAt);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      
      weeklyProgress.push({
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        workoutsCompleted: weekSessions.length,
        totalDuration: weekSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) / 60,
        caloriesBurned: weekSessions.length * 300,
        averageRpe: 6.5, // Mock data
        strengthGains: Math.random() * 10,
        enduranceGains: Math.random() * 15,
      });
    }

    // Generate milestones
    const milestones: Milestone[] = [
      {
        id: "m1",
        userId,
        type: "workout_count",
        title: "First 10 Workouts",
        description: "Completed your first 10 workouts!",
        value: 10,
        unit: "workouts",
        achievedAt: "2024-01-10T00:00:00Z",
      },
      {
        id: "m2",
        userId,
        type: "streak",
        title: "7-Day Streak",
        description: "Worked out for 7 consecutive days!",
        value: 7,
        unit: "days",
        achievedAt: "2024-01-15T00:00:00Z",
      },
      {
        id: "m3",
        userId,
        type: "duration",
        title: "10 Hours Trained",
        description: "Accumulated 10 hours of training time!",
        value: 600,
        unit: "minutes",
        achievedAt: "2024-01-20T00:00:00Z",
      },
    ];

    return {
      userId,
      totalWorkouts: completedSessions.length,
      totalDuration: Math.round(totalDuration / 60),
      totalCaloriesBurned: totalCalories,
      averageWorkoutDuration: completedSessions.length > 0 ? Math.round(totalDuration / completedSessions.length / 60) : 0,
      workoutsThisWeek,
      workoutsThisMonth,
      currentStreak: 5, // Mock data
      longestStreak: 12, // Mock data
      favoriteExerciseType: "strength",
      progressByWeek: weeklyProgress,
      milestones,
    };
  };

  const progress = calculateProgress();

  const getTimeRangeData = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case "week":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case "3months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case "year":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    
    return progress.progressByWeek.filter(week => 
      new Date(week.weekStart) >= startDate
    );
  };

  const timeRangeData = getTimeRangeData();
  const maxWorkouts = Math.max(...timeRangeData.map(w => w.workoutsCompleted), 1);
  const maxDuration = Math.max(...timeRangeData.map(w => w.totalDuration), 1);
  const maxCalories = Math.max(...timeRangeData.map(w => w.caloriesBurned), 1);

  const StatCard = ({ 
    title, 
    value, 
    unit, 
    change, 
    trend, 
    icon: Icon 
  }: {
    title: string;
    value: number | string;
    unit?: string;
    change?: string;
    trend?: "up" | "down" | "neutral";
    icon: any;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {change && (
              <div className={`flex items-center gap-1 text-sm ${
                trend === "up" ? "text-green-600" : 
                trend === "down" ? "text-red-600" : "text-gray-600"
              }`}>
                {trend === "up" && <TrendingUp className="h-3 w-3" />}
                {trend === "down" && <TrendingDown className="h-3 w-3" />}
                {change}
              </div>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  const ChartBar = ({ 
    label, 
    value, 
    maxValue, 
    color = "bg-primary" 
  }: {
    label: string;
    value: number;
    maxValue: number;
    color?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-8 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Dashboard</h1>
          <p className="text-muted-foreground">Track your fitness journey and achievements</p>
        </div>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workout Trends</TabsTrigger>
          <TabsTrigger value="strength">Strength Progress</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Workouts"
              value={progress.totalWorkouts}
              change={`+${progress.workoutsThisMonth} this month`}
              trend="up"
              icon={Target}
            />
            <StatCard
              title="Total Time Trained"
              value={progress.totalDuration}
              unit="hours"
              change={`${progress.averageWorkoutDuration} min avg`}
              trend="neutral"
              icon={Clock}
            />
            <StatCard
              title="Calories Burned"
              value={progress.totalCaloriesBurned.toLocaleString()}
              change={`+15% vs last month`}
              trend="up"
              icon={Flame}
            />
            <StatCard
              title="Current Streak"
              value={progress.currentStreak}
              unit="days"
              change={`Best: ${progress.longestStreak} days`}
              trend="up"
              icon={Zap}
            />
          </div>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Your workout frequency over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeRangeData.map((week, index) => (
                  <ChartBar
                    key={index}
                    label={`Week of ${new Date(week.weekStart).toLocaleDateString()}`}
                    value={week.workoutsCompleted}
                    maxValue={maxWorkouts}
                    color="bg-blue-500"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.milestones.slice(0, 3).map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{milestone.value} {milestone.unit}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(milestone.achievedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-6">
          {/* Workout Volume */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workout Frequency</CardTitle>
                <CardDescription>Number of workouts completed per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeRangeData.map((week, index) => (
                    <ChartBar
                      key={index}
                      label={`Week ${index + 1}`}
                      value={week.workoutsCompleted}
                      maxValue={maxWorkouts}
                      color="bg-green-500"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Duration</CardTitle>
                <CardDescription>Total minutes trained per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeRangeData.map((week, index) => (
                    <ChartBar
                      key={index}
                      label={`Week ${index + 1}`}
                      value={Math.round(week.totalDuration)}
                      maxValue={Math.round(maxDuration)}
                      color="bg-purple-500"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calories Burned */}
          <Card>
            <CardHeader>
              <CardTitle>Calories Burned</CardTitle>
              <CardDescription>Estimated calories burned per week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeRangeData.map((week, index) => (
                  <ChartBar
                    key={index}
                    label={`Week of ${new Date(week.weekStart).toLocaleDateString()}`}
                    value={week.caloriesBurned}
                    maxValue={maxCalories}
                    color="bg-orange-500"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strength" className="space-y-6">
          {/* Strength Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Strength Gains</CardTitle>
                <CardDescription>Weekly strength improvement percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeRangeData.map((week, index) => (
                    <ChartBar
                      key={index}
                      label={`Week ${index + 1}`}
                      value={Math.round(week.strengthGains * 10) / 10}
                      maxValue={10}
                      color="bg-red-500"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endurance Gains</CardTitle>
                <CardDescription>Weekly endurance improvement percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeRangeData.map((week, index) => (
                    <ChartBar
                      key={index}
                      label={`Week ${index + 1}`}
                      value={Math.round(week.enduranceGains * 10) / 10}
                      maxValue={15}
                      color="bg-cyan-500"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Records */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Records</CardTitle>
              <CardDescription>Your best performances in key exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { exercise: "Bench Press", weight: "185 lbs", date: "2024-01-15" },
                  { exercise: "Squat", weight: "225 lbs", date: "2024-01-12" },
                  { exercise: "Deadlift", weight: "275 lbs", date: "2024-01-18" },
                  { exercise: "5K Run", time: "24:30", date: "2024-01-10" },
                  { exercise: "Plank", time: "3:45", date: "2024-01-14" },
                  { exercise: "Pull-ups", reps: "12 reps", date: "2024-01-16" },
                ].map((record, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{record.exercise}</h4>
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {record.weight || record.time || record.reps}
                    </p>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          {/* All Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>All Achievements</CardTitle>
              <CardDescription>Your complete milestone history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <Badge variant="outline">
                          {milestone.value} {milestone.unit}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Date(milestone.achievedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
              <CardDescription>Goals you're close to achieving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "25 Workouts", current: 22, target: 25, progress: 88 },
                  { title: "20 Hours Trained", current: 18.5, target: 20, progress: 92.5 },
                  { title: "14-Day Streak", current: 5, target: 14, progress: 35.7 },
                ].map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{goal.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(goal.progress)}% complete
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressDashboard;