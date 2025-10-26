import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  BarChart3Icon,
  TrophyIcon,
  DumbbellIcon,
  UserIcon,
  LogOutIcon,
  HomeIcon,
  HeartIcon,
  ActivityIcon,
} from "lucide-react";
import ProgressDashboard from "@/components/user/ProgressDashboard";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Feedback, Notification } from "@/types/feedback";
import { WorkoutSession } from "@/types/exercise";

const UserProgressPage = () => {
  const navigate = useNavigate();

  // Mock workout sessions data
  const [workoutSessions] = useState<WorkoutSession[]>([
    {
      id: "session-1",
      userId: 1,
      workoutPlanId: "wp-1",
      startedAt: "2024-01-15T06:00:00Z",
      completedAt: "2024-01-15T06:45:00Z",
      status: "completed",
      totalDuration: 2700,
      notes: "Great morning workout! Felt strong on all exercises.",
      exercises: [],
    },
    {
      id: "session-2",
      userId: 1,
      workoutPlanId: "wp-2",
      startedAt: "2024-01-14T17:30:00Z",
      completedAt: "2024-01-14T18:30:00Z",
      status: "completed",
      totalDuration: 3600,
      notes: "Challenging upper body session.",
      exercises: [],
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  const currentUser = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const handleFeedbackSubmit = (feedbackData: Omit<Feedback, "id" | "createdAt" | "updatedAt">) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: `feedback-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFeedbackList(prev => [...prev, newFeedback]);
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 hidden md:block">
        <div className="flex items-center justify-center mb-8 pt-4">
          <DumbbellIcon className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-xl font-bold">FitTrack</h1>
        </div>

        <nav className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/user/dashboard'}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/user/workouts'}
          >
            <DumbbellIcon className="mr-2 h-4 w-4" />
            Workouts
          </Button>
          <Button 
            variant="default" 
            className="w-full justify-start"
          >
            <BarChart3Icon className="mr-2 h-4 w-4" />
            Progress
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/user/dashboard'}
          >
            <ActivityIcon className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/user/health'}
          >
            <HeartIcon className="mr-2 h-4 w-4" />
            Health Logs
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/user/goals'}
          >
            <TrophyIcon className="mr-2 h-4 w-4" />
            Goals
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/user/schedule'}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/user/profile'}
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
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b p-4 flex justify-between items-center bg-card">
          <h1 className="text-xl font-semibold">Progress Dashboard</h1>
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

        <div className="p-6">
          <ProgressDashboard userId={1} workoutSessions={workoutSessions} />
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

export default UserProgressPage;
