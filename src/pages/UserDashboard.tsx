import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  BarChart3Icon,
  TrophyIcon,
  DumbbellIcon,
  UserIcon,
  LogOutIcon,
  HomeIcon,
  ClockIcon,
  HeartIcon,
  ActivityIcon,
  PlusIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import WorkoutTracking from "@/components/user/WorkoutTracking";
import ProgressDashboard from "@/components/user/ProgressDashboard";
import WorkoutHistory from "@/components/user/WorkoutHistory";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Feedback, Notification } from "@/types/feedback";
import { WorkoutSession, WorkoutPlan, Exercise } from "@/types/exercise";
import UserWorkouts from "./user/UserWorkouts";
import UserHealthLogs from "./user/UserHealthLogs";
import UserGoals from "./user/UserGoals";
import UserSchedule from "./user/UserSchedule";
import UserProfile from "./user/UserProfile";
import UserProgressPage from "./user/UserProgressPage";
import MuscleRecoveryTracker from "@/components/user/MuscleRecoveryTracker";
import RecoveryInsights from "@/components/user/RecoveryInsights";
import MuscleVisualization from "@/components/user/MuscleVisualization";
import WeeklyMuscleHeatmap from "@/components/user/WeeklyMuscleHeatmap";
import ProgressAnalytics from "@/components/user/ProgressAnalytics";

interface WorkoutData {
  id: string;
  name: string;
  assignedBy: string;
  date: string;
  duration: string;
  exercises: number;
  completed: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: string;
}

interface HealthLogData {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  heartRate?: number;
  bloodPressure?: string;
  notes?: string;
}

interface ProgressData {
  week: string;
  workouts: number;
  calories: number;
  weight: number;
}

interface GoalData {
  id: string;
  name: string;
  progress: number;
  target: string;
  deadline: string;
}

interface StatData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState<"dashboard" | "tracking" | "progress" | "history" | "workouts" | "health" | "goals" | "schedule" | "profile">("dashboard");
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [completedSessions, setCompletedSessions] = useState<WorkoutSession[]>([]);

  // Mock workout sessions data with more comprehensive history
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([
    {
      id: "session-1",
      userId: 1,
      workoutPlanId: "wp-1",
      startedAt: "2024-01-15T06:00:00Z",
      completedAt: "2024-01-15T06:45:00Z",
      status: "completed",
      totalDuration: 2700,
      notes: "Great morning workout! Felt strong on all exercises.",
      exercises: [
        {
          id: "ex-log-1",
          sessionId: "session-1",
          exerciseId: "1",
          exercise: {
            id: "1",
            name: "Bench Press",
            description: "Classic chest exercise",
            type: "strength",
            difficulty: "intermediate",
            muscleGroups: ["chest", "shoulders", "triceps"],
            equipment: ["barbell", "bench"],
            instructions: [],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
          completedSets: [
            { id: "set-1", setNumber: 1, reps: 10, weight: 135, restTime: 90, completedAt: "2024-01-15T06:05:00Z" },
            { id: "set-2", setNumber: 2, reps: 10, weight: 135, restTime: 90, completedAt: "2024-01-15T06:07:00Z" },
            { id: "set-3", setNumber: 3, reps: 9, weight: 135, restTime: 90, completedAt: "2024-01-15T06:09:00Z" },
          ],
          skipped: false,
        },
      ],
    },
    {
      id: "session-2",
      userId: 1,
      workoutPlanId: "wp-2",
      startedAt: "2024-01-12T17:30:00Z",
      completedAt: "2024-01-12T18:30:00Z",
      status: "completed",
      totalDuration: 3600,
      exercises: [
        {
          id: "ex-log-2",
          sessionId: "session-2",
          exerciseId: "2",
          exercise: {
            id: "2",
            name: "Squat",
            description: "Leg exercise",
            type: "strength",
            difficulty: "advanced",
            muscleGroups: ["quads", "glutes", "hamstrings"],
            equipment: ["barbell"],
            instructions: [],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
          completedSets: [
            { id: "set-4", setNumber: 1, reps: 8, weight: 185, restTime: 120, completedAt: "2024-01-12T17:35:00Z" },
            { id: "set-5", setNumber: 2, reps: 8, weight: 185, restTime: 120, completedAt: "2024-01-12T17:38:00Z" },
            { id: "set-6", setNumber: 3, reps: 7, weight: 185, restTime: 120, completedAt: "2024-01-12T17:41:00Z" },
          ],
          skipped: false,
        },
      ],
    },
    {
      id: "session-3",
      userId: 1,
      workoutPlanId: "wp-1",
      startedAt: "2024-01-10T06:00:00Z",
      completedAt: "2024-01-10T06:50:00Z",
      status: "completed",
      totalDuration: 3000,
      exercises: [
        {
          id: "ex-log-3",
          sessionId: "session-3",
          exerciseId: "3",
          exercise: {
            id: "3",
            name: "Deadlift",
            description: "Back exercise",
            type: "strength",
            difficulty: "advanced",
            muscleGroups: ["back", "hamstrings", "glutes"],
            equipment: ["barbell"],
            instructions: [],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
          completedSets: [
            { id: "set-7", setNumber: 1, reps: 5, weight: 225, restTime: 180, completedAt: "2024-01-10T06:10:00Z" },
            { id: "set-8", setNumber: 2, reps: 5, weight: 225, restTime: 180, completedAt: "2024-01-10T06:14:00Z" },
            { id: "set-9", setNumber: 3, reps: 5, weight: 225, restTime: 180, completedAt: "2024-01-10T06:18:00Z" },
          ],
          skipped: false,
        },
      ],
    },
    {
      id: "session-4",
      userId: 1,
      workoutPlanId: "wp-1",
      startedAt: "2024-01-08T06:00:00Z",
      completedAt: "2024-01-08T06:45:00Z",
      status: "completed",
      totalDuration: 2700,
      exercises: [
        {
          id: "ex-log-4",
          sessionId: "session-4",
          exerciseId: "1",
          exercise: {
            id: "1",
            name: "Bench Press",
            description: "Classic chest exercise",
            type: "strength",
            difficulty: "intermediate",
            muscleGroups: ["chest", "shoulders", "triceps"],
            equipment: ["barbell", "bench"],
            instructions: [],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
          completedSets: [
            { id: "set-10", setNumber: 1, reps: 10, weight: 130, restTime: 90, completedAt: "2024-01-08T06:05:00Z" },
            { id: "set-11", setNumber: 2, reps: 10, weight: 130, restTime: 90, completedAt: "2024-01-08T06:07:00Z" },
            { id: "set-12", setNumber: 3, reps: 10, weight: 130, restTime: 90, completedAt: "2024-01-08T06:09:00Z" },
          ],
          skipped: false,
        },
      ],
    },
    {
      id: "session-5",
      userId: 1,
      workoutPlanId: "wp-2",
      startedAt: "2024-01-05T17:30:00Z",
      completedAt: "2024-01-05T18:30:00Z",
      status: "completed",
      totalDuration: 3600,
      exercises: [
        {
          id: "ex-log-5",
          sessionId: "session-5",
          exerciseId: "2",
          exercise: {
            id: "2",
            name: "Squat",
            description: "Leg exercise",
            type: "strength",
            difficulty: "advanced",
            muscleGroups: ["quads", "glutes", "hamstrings"],
            equipment: ["barbell"],
            instructions: [],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
          completedSets: [
            { id: "set-13", setNumber: 1, reps: 8, weight: 175, restTime: 120, completedAt: "2024-01-05T17:35:00Z" },
            { id: "set-14", setNumber: 2, reps: 8, weight: 175, restTime: 120, completedAt: "2024-01-05T17:38:00Z" },
            { id: "set-15", setNumber: 3, reps: 8, weight: 175, restTime: 120, completedAt: "2024-01-05T17:41:00Z" },
          ],
          skipped: false,
        },
      ],
    },
    {
      id: "session-6",
      userId: 1,
      workoutPlanId: "wp-1",
      startedAt: "2024-01-03T06:00:00Z",
      completedAt: "2024-01-03T06:50:00Z",
      status: "completed",
      totalDuration: 3000,
      exercises: [
        {
          id: "ex-log-6",
          sessionId: "session-6",
          exerciseId: "4",
          exercise: {
            id: "4",
            name: "Overhead Press",
            description: "Shoulder exercise",
            type: "strength",
            difficulty: "intermediate",
            muscleGroups: ["shoulders", "triceps"],
            equipment: ["barbell"],
            instructions: [],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
          completedSets: [
            { id: "set-16", setNumber: 1, reps: 8, weight: 95, restTime: 90, completedAt: "2024-01-03T06:10:00Z" },
            { id: "set-17", setNumber: 2, reps: 8, weight: 95, restTime: 90, completedAt: "2024-01-03T06:13:00Z" },
            { id: "set-18", setNumber: 3, reps: 7, weight: 95, restTime: 90, completedAt: "2024-01-03T06:16:00Z" },
          ],
          skipped: false,
        },
      ],
    },
  ]);

  // Mock workout plans for tracking
  const mockWorkoutPlans: WorkoutPlan[] = [
    {
      id: "wp-1",
      name: "Morning Cardio Blast",
      description: "High-intensity cardio workout to start your day",
      exercises: [
        {
          exerciseId: "1",
          exercise: {
            id: "1",
            name: "Jumping Jacks",
            description: "Full body cardio exercise",
            type: "cardio",
            difficulty: "beginner",
            muscleGroups: ["full body"],
            equipment: ["bodyweight"],
            instructions: ["Stand with feet together", "Jump while spreading legs and raising arms"],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
          sets: 3,
          duration: 60,
          restTime: 30,
          order: 1,
        },
        {
          exerciseId: "2",
          exercise: {
            id: "2",
            name: "Burpees",
            description: "Full-body high-intensity exercise",
            type: "hiit",
            difficulty: "advanced",
            muscleGroups: ["full body"],
            equipment: ["bodyweight"],
            instructions: ["Start standing", "Drop to squat", "Jump back to plank", "Return to standing"],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
          sets: 3,
          reps: 10,
          restTime: 90,
          order: 2,
        },
      ],
      totalDuration: 45,
      difficulty: "intermediate",
      type: "Cardio",
      createdBy: "Coach Sarah",
      createdAt: "2024-01-01",
    },
  ];

  // Default assigned workouts data
  const assignedWorkouts: WorkoutData[] = [
    {
      id: "1",
      name: "Morning Cardio Blast",
      assignedBy: "Coach Sarah",
      date: "Today, 6:00 AM",
      duration: "45 min",
      exercises: 5,
      completed: true,
      difficulty: "intermediate",
      type: "Cardio",
    },
    {
      id: "2",
      name: "Upper Body Strength",
      assignedBy: "Coach Mike",
      date: "Tomorrow, 5:30 PM",
      duration: "60 min",
      exercises: 8,
      completed: false,
      difficulty: "advanced",
      type: "Strength",
    },
    {
      id: "3",
      name: "Leg Day Challenge",
      assignedBy: "Coach Sarah",
      date: "Wed, 6:00 PM",
      duration: "50 min",
      exercises: 6,
      completed: false,
      difficulty: "intermediate",
      type: "Strength",
    },
    {
      id: "4",
      name: "Flexibility & Recovery",
      assignedBy: "Coach Lisa",
      date: "Thu, 7:00 AM",
      duration: "30 min",
      exercises: 4,
      completed: false,
      difficulty: "beginner",
      type: "Recovery",
    },
  ];

  // Health logs data
  const healthLogs: HealthLogData[] = [
    {
      id: "1",
      date: "2024-01-15",
      weight: 165,
      bodyFat: 18.5,
      heartRate: 72,
      bloodPressure: "120/80",
      notes: "Feeling energetic after morning workout",
    },
    {
      id: "2",
      date: "2024-01-14",
      weight: 165.5,
      heartRate: 75,
      notes: "Good recovery day",
    },
    {
      id: "3",
      date: "2024-01-13",
      weight: 166,
      bodyFat: 18.8,
      heartRate: 78,
      bloodPressure: "118/78",
    },
    {
      id: "4",
      date: "2024-01-12",
      weight: 166.2,
      heartRate: 74,
      notes: "Completed intense leg workout",
    },
  ];

  // Progress tracking data
  const progressData: ProgressData[] = [
    { week: "Week 1", workouts: 3, calories: 1200, weight: 168 },
    { week: "Week 2", workouts: 4, calories: 1450, weight: 167 },
    { week: "Week 3", workouts: 5, calories: 1680, weight: 166.5 },
    { week: "Week 4", workouts: 4, calories: 1520, weight: 165.8 },
    { week: "Week 5", workouts: 6, calories: 1890, weight: 165.2 },
    { week: "Week 6", workouts: 5, calories: 1750, weight: 165 },
  ];

  // Default goals data
  const goals: GoalData[] = [
    {
      id: "1",
      name: "Weight Loss Goal",
      progress: 75,
      target: "10 lbs",
      deadline: "In 2 weeks",
    },
    {
      id: "2",
      name: "5K Run Time",
      progress: 60,
      target: "Under 25 minutes",
      deadline: "In 4 weeks",
    },
    {
      id: "3",
      name: "Strength Training",
      progress: 40,
      target: "Bench 200 lbs",
      deadline: "In 8 weeks",
    },
  ];

  // Default stats data
  const stats: StatData[] = [
    {
      label: "Workouts This Week",
      value: "5",
      change: "+2",
      trend: "up",
    },
    {
      label: "Calories Burned",
      value: "2,340",
      change: "+15%",
      trend: "up",
    },
    {
      label: "Current Weight",
      value: "165 lbs",
      change: "-3 lbs",
      trend: "down",
    },
    {
      label: "Avg. Heart Rate",
      value: "74 bpm",
      change: "-2 bpm",
      trend: "down",
    },
  ];

  // Feedback and Notifications state
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      userId: 1,
      type: "workout_assigned",
      title: "New Workout Assigned",
      message: "Coach Sarah has assigned you a new upper body workout for tomorrow.",
      read: false,
      actionUrl: "/workouts/assigned",
      actionLabel: "View Workout",
      createdAt: "2024-01-20T10:30:00Z",
    },
    {
      id: "notif-2",
      userId: 1,
      type: "feedback_updated",
      title: "Feedback Update",
      message: "Your bug report about the timer has been resolved. Thanks for reporting!",
      read: false,
      actionUrl: "/feedback/bug-123",
      actionLabel: "View Details",
      createdAt: "2024-01-19T15:45:00Z",
    },
    {
      id: "notif-3",
      userId: 1,
      type: "system_update",
      title: "New Features Available",
      message: "Check out the new progress tracking charts in your dashboard!",
      read: true,
      createdAt: "2024-01-18T09:00:00Z",
    },
  ]);

  // Mock user data
  const currentUser = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const EmptyState = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );

  const handleStartWorkout = (workout: WorkoutData) => {
    // Find the corresponding workout plan
    const workoutPlan = mockWorkoutPlans.find(wp => wp.name === workout.name);
    if (workoutPlan) {
      setSelectedWorkout(workoutPlan);
      setActiveView("tracking");
    }
  };

  const handleCompleteWorkout = (session: WorkoutSession) => {
    console.log('Workout completed:', session);
    setCompletedSessions(prev => [...prev, session]);
    
    // Calculate which muscles were worked
    const musclesWorked = new Set<string>();
    session.exercises.forEach(ex => {
      if (!ex.skipped) {
        ex.exercise.muscleGroups.forEach(muscle => {
          musclesWorked.add(muscle);
        });
      }
    });

    // Show recovery timeline notification
    const muscleList = Array.from(musclesWorked).join(', ');
    console.log(`Muscles worked: ${muscleList}. Recovery tracking updated.`);
    
    setActiveWorkout(null);
    // Here you would typically save to backend and trigger recovery recalculation
  };

  const handleCancelWorkout = () => {
    setSelectedWorkout(null);
    setActiveView("dashboard");
  };

  const handleFeedbackSubmit = (feedbackData: Omit<Feedback, "id" | "createdAt" | "updatedAt">) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: `feedback-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFeedbackList(prev => [...prev, newFeedback]);

    // Create notification for admin (in real app, this would be sent to admin users)
    const adminNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId: 0, // Admin user ID
      type: "feedback_received",
      title: "New Feedback Received",
      message: `${feedbackData.userName} submitted a ${feedbackData.type.replace("_", " ")}: ${feedbackData.title}`,
      read: false,
      actionUrl: `/admin/feedback/${newFeedback.id}`,
      actionLabel: "Review Feedback",
      createdAt: new Date().toISOString(),
      metadata: {
        feedbackId: newFeedback.id,
        feedbackType: feedbackData.type,
        priority: feedbackData.priority,
      },
    };

    // In a real app, you'd send this to the admin notification system
    console.log("Admin notification created:", adminNotification);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  // Render different views based on activeView state
  if (activeView === "tracking" && selectedWorkout) {
    return (
      <div className="relative">
        <WorkoutTracking
          workoutPlan={selectedWorkout}
          onComplete={handleCompleteWorkout}
          onCancel={handleCancelWorkout}
        />
        {/* Global Feedback Button */}
        <FeedbackButton
          userId={currentUser.id}
          userName={currentUser.name}
          userEmail={currentUser.email}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 hidden md:block flex-shrink-0 overflow-y-auto">
        <div className="flex items-center justify-center mb-8 pt-4">
          <DumbbellIcon className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-xl font-bold">FitTrack</h1>
        </div>

        <nav className="space-y-2">
          <Button 
            variant={activeView === "dashboard" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveView("dashboard")}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant={activeView === "workouts" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveView("workouts")}
          >
            <DumbbellIcon className="mr-2 h-4 w-4" />
            Workouts
          </Button>
          <Button 
            variant={activeView === "progress" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveView("progress")}
          >
            <BarChart3Icon className="mr-2 h-4 w-4" />
            Progress
          </Button>
          <Button 
            variant={activeView === "history" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveView("history")}
          >
            <ActivityIcon className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button 
            variant={activeView === "health" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveView("health")}
          >
            <HeartIcon className="mr-2 h-4 w-4" />
            Health Logs
          </Button>
          <Button 
            variant={activeView === "goals" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveView("goals")}
          >
            <TrophyIcon className="mr-2 h-4 w-4" />
            Goals
          </Button>
          <Button 
            variant={activeView === "schedule" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveView("schedule")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button 
            variant={activeView === "profile" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveView("profile")}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>

        <div className="absolute bottom-4 w-56">
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/")}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="border-b p-4 flex justify-between items-center bg-card flex-shrink-0">
          <h1 className="text-xl font-semibold">
            {activeView === "dashboard" && "Dashboard"}
            {activeView === "workouts" && "My Workouts"}
            {activeView === "progress" && "Progress Dashboard"}
            {activeView === "history" && "Workout History"}
            {activeView === "health" && "Health Logs"}
            {activeView === "goals" && "My Goals"}
            {activeView === "schedule" && "Workout Schedule"}
            {activeView === "profile" && "Profile Settings"}
          </h1>
          <div className="flex items-center gap-4">
            <NotificationCenter
              userId={currentUser.id}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDeleteNotification={handleDeleteNotification}
            />
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Today
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">John Doe</span>
              <Avatar>
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  alt="User"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {/* Dashboard Tab */}
          {activeView === "dashboard" && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recovery">Recovery</TabsTrigger>
                <TabsTrigger value="workouts">Assigned Workouts</TabsTrigger>
                <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
                <TabsTrigger value="health">Health Logs</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline">
                          <h3 className="text-2xl font-bold">{stat.value}</h3>
                          <span
                            className={`ml-2 text-sm ${stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-gray-500"}`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Assigned Workouts Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Assigned Workouts</CardTitle>
                    <CardDescription>
                      Workouts assigned by your trainers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {assignedWorkouts.filter(w => w.date.includes("Today")).length > 0 ? (
                      <div className="space-y-4">
                        {assignedWorkouts.filter(w => w.date.includes("Today")).map((workout) => (
                          <div
                            key={workout.id}
                            className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-3">
                              {workout.completed ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                              ) : (
                                <ClockIcon className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div>
                                <h4 className="font-medium">{workout.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Assigned by {workout.assignedBy} • {workout.duration}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getDifficultyColor(workout.difficulty)}>
                                {workout.difficulty}
                              </Badge>
                              <Button
                                size="sm"
                                variant={workout.completed ? "outline" : "default"}
                              >
                                {workout.completed ? "Completed" : "Start"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No workouts for today"
                        description="Your trainer hasn't assigned any workouts for today. Check back later or contact your trainer."
                        icon={DumbbellIcon}
                      />
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <DumbbellIcon className="mr-2 h-4 w-4" />
                      View All Assigned Workouts
                    </Button>
                  </CardFooter>
                </Card>

                {/* Goals Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Goals Progress</CardTitle>
                    <CardDescription>Track your fitness goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{goal.name}</span>
                            <span className="text-sm">
                              {goal.progress}% • {goal.target}
                            </span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-right">
                            {goal.deadline}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <TrophyIcon className="mr-2 h-4 w-4" />
                      Manage Goals
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Recovery Tab */}
              <TabsContent value="recovery" className="space-y-6">
                <MuscleVisualization 
                  workoutHistory={workoutSessions}
                  showRecovery={true}
                />
                
                <WeeklyMuscleHeatmap workoutHistory={workoutSessions} />
                
                <MuscleRecoveryTracker 
                  workoutHistory={workoutSessions}
                  onMuscleClick={(muscle) => {
                    console.log('View history for:', muscle);
                    // Could navigate to exercise history filtered by muscle group
                  }}
                />
                
                <RecoveryInsights workoutHistory={workoutSessions} />
              </TabsContent>

              <TabsContent value="workouts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assigned Workouts</CardTitle>
                    <CardDescription>
                      Workouts assigned by your trainers and coaches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {assignedWorkouts.length > 0 ? (
                      <div className="space-y-4">
                        {assignedWorkouts.map((workout) => (
                          <div
                            key={workout.id}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                {workout.completed ? (
                                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                ) : (
                                  <ClockIcon className="h-6 w-6 text-muted-foreground" />
                                )}
                                <div>
                                  <h3 className="font-semibold">{workout.name}</h3>
                                  <p className="text-sm text-muted-foreground">
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  {workout.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ClockIcon className="h-4 w-4" />
                                  {workout.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ActivityIcon className="h-4 w-4" />
                                  {workout.exercises} exercises
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant={workout.completed ? "outline" : "default"}
                                onClick={() => !workout.completed && handleStartWorkout(workout)}
                                disabled={workout.completed}
                              >
                                {workout.completed ? "View Details" : "Start Workout"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No assigned workouts"
                        description="Your trainer hasn't assigned any workouts yet. Contact your trainer to get started with your fitness journey."
                        icon={DumbbellIcon}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Tracking Charts</CardTitle>
                    <CardDescription>
                      Visual representation of your fitness journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Weekly Progress Chart Placeholder */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Weekly Progress</h3>
                        <div className="h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <BarChart3Icon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">Progress chart will appear here</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Tracking workouts, calories, and weight over time
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Data Table */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Progress Data</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {progressData.slice(-3).map((data, index) => (
                            <Card key={index}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">{data.week}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Workouts:</span>
                                  <span className="font-medium">{data.workouts}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Calories:</span>
                                  <span className="font-medium">{data.calories}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Weight:</span>
                                  <span className="font-medium">{data.weight} lbs</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="health" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Health Logs</h2>
                    <p className="text-muted-foreground">Track your health metrics over time</p>
                  </div>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Entry
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Health Entries</CardTitle>
                    <CardDescription>
                      Your latest health and wellness data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {healthLogs.length > 0 ? (
                      <div className="space-y-4">
                        {healthLogs.map((log) => (
                          <div
                            key={log.id}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{log.date}</h3>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Weight:</span>
                                <p className="font-medium">{log.weight} lbs</p>
                              </div>
                              {log.bodyFat && (
                                <div>
                                  <span className="text-muted-foreground">Body Fat:</span>
                                  <p className="font-medium">{log.bodyFat}%</p>
                                </div>
                              )}
                              {log.heartRate && (
                                <div>
                                  <span className="text-muted-foreground">Heart Rate:</span>
                                  <p className="font-medium">{log.heartRate} bpm</p>
                                </div>
                              )}
                              {log.bloodPressure && (
                                <div>
                                  <span className="text-muted-foreground">Blood Pressure:</span>
                                  <p className="font-medium">{log.bloodPressure}</p>
                                </div>
                              )}
                            </div>
                            {log.notes && (
                              <div>
                                <span className="text-muted-foreground text-sm">Notes:</span>
                                <p className="text-sm mt-1">{log.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No health logs yet"
                        description="Start tracking your health metrics like weight, heart rate, and other vital signs to monitor your progress."
                        icon={HeartIcon}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals">
                <Card>
                  <CardHeader>
                    <CardTitle>Fitness Goals</CardTitle>
                    <CardDescription>
                      Set and track your fitness goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {goals.map((goal) => (
                        <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{goal.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Target: {goal.target} • {goal.deadline}
                              </p>
                            </div>
                            <Badge variant="outline">{goal.progress}%</Badge>
                          </div>
                          <Progress value={goal.progress} className="h-3" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progress</span>
                            <span>{goal.progress}% complete</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add New Goal
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Workouts Tab */}
          {activeView === "workouts" && <UserWorkouts />}

          {/* Progress Tab */}
          {activeView === "progress" && (
            <ProgressAnalytics workoutHistory={workoutSessions} />
          )}

          {/* History Tab */}
          {activeView === "history" && (
            <WorkoutHistory workoutSessions={workoutSessions} />
          )}

          {/* Health Logs Tab */}
          {activeView === "health" && <UserHealthLogs />}

          {/* Goals Tab */}
          {activeView === "goals" && <UserGoals />}

          {/* Schedule Tab */}
          {activeView === "schedule" && <UserSchedule />}

          {/* Profile Tab */}
          {activeView === "profile" && <UserProfile />}

          {/* Tracking Tab */}
          {activeView === "tracking" && (
            <div className="relative">
              <WorkoutTracking
                workoutPlan={selectedWorkout}
                onComplete={handleCompleteWorkout}
                onCancel={handleCancelWorkout}
              />
              {/* Global Feedback Button */}
              <FeedbackButton
                userId={currentUser.id}
                userName={currentUser.name}
                userEmail={currentUser.email}
                onFeedbackSubmit={handleFeedbackSubmit}
              />
            </div>
          )}
        </div>
      </div>

      {/* Global Feedback Button */}
      <FeedbackButton
        userId={currentUser.id}
        userName={currentUser.name}
        userEmail={currentUser.email}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default UserDashboard;