import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockClients } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ProfileSkeleton } from "@/components/ui/skeleton-loader";
import {
  ArrowLeft,
  Dumbbell,
  MessageSquare,
  Edit,
  Calendar,
  Mail,
  Award,
  CheckCircle,
  TrendingUp,
  Target,
  Flame,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ClientDetailPageProps {
  clientId?: string;
  embedded?: boolean;
}

const ClientDetailPage = ({ clientId: propClientId, embedded = false }: ClientDetailPageProps) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  const id = propClientId || paramId;
  const client = mockClients.find((c) => c.id === id);

  React.useEffect(() => {
    if (client) {
      setNotes(client.notes);
    }
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [client]);

  if (isLoading) {
    return (
      <div className={embedded ? "space-y-6" : "min-h-screen bg-gray-50 animate-in fade-in duration-200"}>
        <div className={embedded ? "" : "max-w-7xl mx-auto p-6 space-y-6"}>
          {!embedded && (
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Client Management
            </Button>
          )}
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className={embedded ? "space-y-6" : "min-h-screen bg-gray-50 flex items-center justify-center"}>
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Client Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The client you're looking for doesn't exist.
          </p>
          {!embedded && (
            <Button onClick={() => navigate("/admin/clients")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Client Management
            </Button>
          )}
        </Card>
      </div>
    );
  }

  const getGoalBadgeColor = (goal: string) => {
    switch (goal) {
      case "weight-loss":
        return "bg-blue-100 text-blue-800";
      case "muscle-building":
        return "bg-purple-100 text-purple-800";
      case "strength":
        return "bg-red-100 text-red-800";
      case "calisthenics-mastery":
        return "bg-green-100 text-green-800";
      case "general-fitness":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "needs-attention":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatGoalLabel = (goal: string) => {
    return goal
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatStatusLabel = (status: string) => {
    if (status === "needs-attention") return "Needs Attention";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleSaveNotes = () => {
    console.log("Saving notes:", notes);
    // TODO: Implement save functionality
  };

  // Mock data for recent workouts
  const recentWorkouts = [
    {
      id: 1,
      name: "Upper Body Strength",
      date: "2024-03-19T18:00:00Z",
      completed: true,
    },
    {
      id: 2,
      name: "Lower Body Power",
      date: "2024-03-17T10:30:00Z",
      completed: true,
    },
    {
      id: 3,
      name: "Core & Conditioning",
      date: "2024-03-15T16:00:00Z",
      completed: true,
    },
    {
      id: 4,
      name: "Full Body Circuit",
      date: "2024-03-13T08:00:00Z",
      completed: false,
    },
    {
      id: 5,
      name: "Active Recovery",
      date: "2024-03-11T12:00:00Z",
      completed: true,
    },
  ];

  const currentStreak = 12; // Mock data
  const avgWeeklyWorkouts = 4.2; // Mock data

  return (
    <div className={embedded ? "space-y-6" : "min-h-screen bg-gray-50 animate-in fade-in duration-200"}>
      <div className={embedded ? "" : "max-w-7xl mx-auto p-6 space-y-6"}>
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {!embedded && (
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/clients")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Client Management
            </Button>
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Photo */}
            <img
              src={client.profilePhoto}
              alt={client.name}
              className="h-24 w-24 rounded-full object-cover border-4 border-gray-100"
            />

            {/* Client Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {client.name}
                </h1>
                <Badge className={getGoalBadgeColor(client.goal)}>
                  {formatGoalLabel(client.goal)}
                </Badge>
                <Badge className={getStatusBadgeColor(client.status)}>
                  {formatStatusLabel(client.status)}
                </Badge>
              </div>
              <p className="text-gray-500">{client.email}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => console.log("Assign workout")}>
                <Dumbbell className="mr-2 h-4 w-4" />
                Assign Workout
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Send message")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Edit profile")}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Program Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Current Program
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {client.currentProgram ? (
                      <>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {client.currentProgram}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Started {format(new Date(client.dateJoined), "MMMM d, yyyy")}
                          </p>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">Week 4 of 12</span>
                          </div>
                          <Progress value={33} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-gray-600">
                            Program Compliance
                          </span>
                          <span className="text-lg font-semibold text-gray-900">
                            {client.complianceRate}%
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500">No active program</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentWorkouts.map((workout) => (
                        <div
                          key={workout.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                workout.completed
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {workout.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(workout.date), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                          {workout.completed && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="link"
                      className="w-full mt-4"
                      onClick={() => setActiveTab("workouts")}
                    >
                      View All Workouts
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <Dumbbell className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Total Workouts
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {client.totalWorkoutsCompleted}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <Flame className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Current Streak
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {currentStreak} days
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Avg Weekly</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {avgWeeklyWorkouts}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Column (1/3 width) */}
              <div className="space-y-6">
                {/* Client Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-600" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {client.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date Joined</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(client.dateJoined), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience Level</p>
                      <Badge className="mt-1">
                        {client.experienceLevel.charAt(0).toUpperCase() +
                          client.experienceLevel.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Equipment Available
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {client.equipment.map((item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="text-xs"
                          >
                            {item
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Nutrition Tracking
                      </p>
                      <p className="font-medium text-gray-900">
                        {client.nutritionTracking ? "Yes" : "No"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Coach Notes Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Coach Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this client..."
                      className="min-h-[150px]"
                    />
                    <Button onClick={handleSaveNotes} className="w-full">
                      Save Notes
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Last updated: {format(new Date(), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts">
            <Card className="p-12 text-center">
              <Dumbbell className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Workouts Coming Soon
              </h3>
              <p className="text-gray-500">
                This section will display all assigned workouts and their
                completion status.
              </p>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card className="p-12 text-center">
              <TrendingUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Progress Tracking Coming Soon
              </h3>
              <p className="text-gray-500">
                This section will display progress charts, measurements, and
                achievements.
              </p>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-12 text-center">
              <Edit className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Settings Coming Soon
              </h3>
              <p className="text-gray-500">
                This section will allow you to edit client settings and
                preferences.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDetailPage;