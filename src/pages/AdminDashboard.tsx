import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HomeIcon, 
  UsersIcon, 
  DumbbellIcon, 
  ActivityIcon, 
  TrophyIcon, 
  SettingsIcon, 
  BellIcon, 
  SearchIcon, 
  PlusIcon, 
  MoreVerticalIcon,
  CalendarIcon,
  ClockIcon,
  TrendingUpIcon,
  MessageSquareIcon,
  ShieldIcon,
  LogOutIcon,
  BarChart3Icon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon
} from "lucide-react";
import ExerciseLibrary from "@/components/admin/ExerciseLibrary";
import FeedbackManagement from "@/components/admin/FeedbackManagement";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import { mockClients } from "@/types/client";
import type { Feedback } from "@/types/feedback";
import ClientManagement from "@/components/admin/ClientManagement";

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  exercises: number;
  assignedTo: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user";
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [viewingClientId, setViewingClientId] = useState<string | null>(null);
  const [workoutBuilderOpen, setWorkoutBuilderOpen] = useState(false);
  const [workoutAssignmentOpen, setWorkoutAssignmentOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([
    {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      userEmail: "john@example.com",
      category: "bug",
      title: "Workout timer not working",
      description: "The timer stops when I switch apps",
      status: "open",
      priority: "high",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    }
  ]);

  const workoutPlans: WorkoutPlan[] = [
    {
      id: "1",
      name: "Beginner Full Body",
      description: "Perfect for those starting their fitness journey",
      duration: "4 weeks",
      difficulty: "Beginner",
      exercises: 8,
      assignedTo: 12
    },
    {
      id: "2",
      name: "Advanced HIIT",
      description: "High-intensity interval training for experienced athletes",
      duration: "6 weeks",
      difficulty: "Advanced",
      exercises: 15,
      assignedTo: 8
    },
    {
      id: "3",
      name: "Strength Building",
      description: "Focus on building muscle mass and strength",
      duration: "8 weeks",
      difficulty: "Intermediate",
      exercises: 12,
      assignedTo: 15
    }
  ];

  const recentUsers: User[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      role: "user"
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      role: "user"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 hidden md:block flex-shrink-0 overflow-y-auto">
        <div className="flex items-center justify-center mb-8 pt-4">
          <ShieldIcon className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("overview")}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeTab === "clients" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("clients")}
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Client Management
          </Button>
          <Button
            variant={activeTab === "workouts" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("workouts")}
          >
            <DumbbellIcon className="mr-2 h-4 w-4" />
            Workout Plans
          </Button>
          <Button
            variant={activeTab === "exercises" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("exercises")}
          >
            <ActivityIcon className="mr-2 h-4 w-4" />
            Exercise Library
          </Button>
          <Button
            variant={activeTab === "feedback" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("feedback")}
          >
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            Feedback
            {feedbackList.filter(f => f.status === "open").length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {feedbackList.filter(f => f.status === "open").length}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "progress" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("progress")}
          >
            <BarChart3Icon className="mr-2 h-4 w-4" />
            Progress Stats
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
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
            {activeTab === "overview" && "Admin Dashboard"}
            {activeTab === "clients" && "Client Management"}
            {activeTab === "workouts" && "Workout Plans"}
            {activeTab === "exercises" && "Exercise Library"}
            {activeTab === "feedback" && "Feedback Management"}
            {activeTab === "progress" && "Progress Statistics"}
            {activeTab === "settings" && "Settings"}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <BellIcon className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockClients.length}</div>
                    <p className="text-xs text-muted-foreground">+3 from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Workouts</CardTitle>
                    <DumbbellIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+12% from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Compliance</CardTitle>
                    <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
                    <TrophyIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">156</div>
                    <p className="text-xs text-muted-foreground">+23 this month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <Button className="h-20" onClick={() => navigate("/admin/clients")}>
                    <div className="flex flex-col items-center gap-2">
                      <UsersIcon className="h-6 w-6" />
                      <span>Manage Clients</span>
                    </div>
                  </Button>
                  <Button className="h-20" variant="outline" onClick={() => setActiveTab("workouts")}>
                    <div className="flex flex-col items-center gap-2">
                      <PlusIcon className="h-6 w-6" />
                      <span>Create Workout</span>
                    </div>
                  </Button>
                  <Button className="h-20" variant="outline" onClick={() => setActiveTab("feedback")}>
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquareIcon className="h-6 w-6" />
                      <span>View Feedback</span>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Clients</CardTitle>
                    <CardDescription>Newly registered users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Compliance</CardTitle>
                    <CardDescription>Top performing clients this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockClients.slice(0, 3).map((client) => (
                        <div key={client.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{client.name}</span>
                            <span className="text-sm text-muted-foreground">{client.compliance}%</span>
                          </div>
                          <Progress value={client.compliance} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Client Management Tab */}
          {activeTab === "clients" && (
            <ClientManagement 
              viewingClientId={viewingClientId}
              onViewClient={(clientId) => setViewingClientId(clientId)}
              onBackToList={() => setViewingClientId(null)}
            />
          )}

          {/* Workout Plans Tab */}
          {activeTab === "workouts" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Workout Plans</h2>
                  <p className="text-muted-foreground">Manage and create workout programs</p>
                </div>
                <Button onClick={() => setWorkoutBuilderOpen(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Workout
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workoutPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{plan.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Difficulty</span>
                          <Badge variant={
                            plan.difficulty === "Beginner" ? "secondary" :
                            plan.difficulty === "Intermediate" ? "default" : "destructive"
                          }>
                            {plan.difficulty}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Exercises</span>
                          <span className="font-medium">{plan.exercises}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Assigned to</span>
                          <span className="font-medium">{plan.assignedTo} clients</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                        <Button size="sm" className="flex-1">Assign</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Library Tab */}
          {activeTab === "exercises" && <ExerciseLibrary />}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <FeedbackManagement 
              feedbackList={feedbackList}
              onUpdateFeedback={(id, updates) => {
                setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
              }}
            />
          )}

          {/* Progress Stats Tab */}
          {activeTab === "progress" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Progress Statistics</h2>
                <p className="text-muted-foreground">Track client progress and achievements</p>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Progress statistics coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Settings</h2>
                <p className="text-muted-foreground">Manage your admin preferences</p>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <FeedbackButton />
    </div>
  );
};

export default AdminDashboard;