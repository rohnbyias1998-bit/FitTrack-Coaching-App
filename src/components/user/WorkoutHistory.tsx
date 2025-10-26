import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Target,
  CheckCircle,
  Search,
  Filter,
  Eye,
  BarChart3,
  TrendingUp,
  Award,
} from "lucide-react";
import { WorkoutSession, ExerciseLog, SetLog } from "@/types/exercise";

interface WorkoutHistoryProps {
  workoutSessions: WorkoutSession[];
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workoutSessions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "duration" | "exercises">("date");

  const filteredSessions = workoutSessions
    .filter(session => {
      const matchesSearch = session.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.exercises.some(ex => 
                             ex.exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesStatus = statusFilter === "all" || session.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
        case "duration":
          return (b.totalDuration || 0) - (a.totalDuration || 0);
        case "exercises":
          return b.exercises.length - a.exercises.length;
        default:
          return 0;
      }
    });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateSessionStats = (session: WorkoutSession) => {
    const completedExercises = session.exercises.filter(ex => 
      ex.completedSets.length > 0 && !ex.skipped
    ).length;
    
    const totalSets = session.exercises.reduce((sum, ex) => 
      sum + ex.completedSets.length, 0
    );
    
    const totalReps = session.exercises.reduce((sum, ex) => 
      sum + ex.completedSets.reduce((setSum, set) => setSum + (set.reps || 0), 0), 0
    );
    
    const totalWeight = session.exercises.reduce((sum, ex) => 
      sum + ex.completedSets.reduce((setSum, set) => setSum + (set.weight || 0), 0), 0
    );
    
    const averageRpe = session.exercises.reduce((sum, ex) => {
      const exerciseRpe = ex.completedSets.reduce((rpeSum, set) => 
        rpeSum + (set.rpe || 0), 0
      ) / (ex.completedSets.length || 1);
      return sum + exerciseRpe;
    }, 0) / (session.exercises.length || 1);

    return {
      completedExercises,
      totalSets,
      totalReps,
      totalWeight,
      averageRpe: Math.round(averageRpe * 10) / 10,
    };
  };

  const SessionDetailDialog = ({ session }: { session: WorkoutSession }) => {
    const stats = calculateSessionStats(session);
    
    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Workout Session Details</DialogTitle>
          <DialogDescription>
            {new Date(session.startedAt).toLocaleDateString()} • {formatDuration(session.totalDuration || 0)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Session Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.completedExercises}</p>
                <p className="text-xs text-muted-foreground">Exercises</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.totalSets}</p>
                <p className="text-xs text-muted-foreground">Sets</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.totalReps}</p>
                <p className="text-xs text-muted-foreground">Reps</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{Math.round(stats.totalWeight)}</p>
                <p className="text-xs text-muted-foreground">lbs Lifted</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.averageRpe}</p>
                <p className="text-xs text-muted-foreground">Avg RPE</p>
              </div>
            </Card>
          </div>

          {/* Exercise Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exercise Breakdown</h3>
            {session.exercises.map((exercise, index) => (
              <Card key={exercise.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{exercise.exercise.name}</CardTitle>
                    <div className="flex gap-2">
                      {exercise.skipped && <Badge variant="secondary">Skipped</Badge>}
                      {exercise.completedSets.length > 0 && (
                        <Badge className="bg-green-100 text-green-800">
                          {exercise.completedSets.length} sets
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {exercise.skipped ? (
                    <p className="text-muted-foreground text-sm">This exercise was skipped</p>
                  ) : exercise.completedSets.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No sets completed</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground">
                        <span>Set</span>
                        <span>Weight</span>
                        <span>Reps</span>
                        <span>Duration</span>
                        <span>RPE</span>
                        <span>Rest</span>
                      </div>
                      {exercise.completedSets.map((set, setIndex) => (
                        <div key={set.id} className="grid grid-cols-6 gap-2 text-sm">
                          <span className="font-medium">{set.setNumber}</span>
                          <span>{set.weight ? `${set.weight} lbs` : "-"}</span>
                          <span>{set.reps || "-"}</span>
                          <span>{set.duration ? `${set.duration}s` : "-"}</span>
                          <span>{set.rpe || "-"}</span>
                          <span>{set.restTime ? `${set.restTime}s` : "-"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {exercise.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm">
                        <span className="font-medium">Notes: </span>
                        {exercise.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Session Notes */}
          {session.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Session Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{session.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workout History</h2>
          <p className="text-muted-foreground">Review your past workout sessions</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="duration">Sort by Duration</SelectItem>
              <SelectItem value="exercises">Sort by Exercises</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <h3 className="text-2xl font-bold">{workoutSessions.length}</h3>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold">
                  {workoutSessions.filter(s => s.status === "completed").length}
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                <h3 className="text-2xl font-bold">
                  {formatDuration(workoutSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0))}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <h3 className="text-2xl font-bold">
                  {workoutSessions.filter(s => {
                    const sessionDate = new Date(s.startedAt);
                    const weekStart = new Date();
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                    return sessionDate >= weekStart;
                  }).length}
                </h3>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workout Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>
            {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No sessions found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Start your first workout to see it here"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => {
                const stats = calculateSessionStats(session);
                return (
                  <Card key={session.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {new Date(session.startedAt).toLocaleDateString()}
                          </h3>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(session.totalDuration || 0)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {stats.completedExercises}/{session.exercises.length} exercises
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            {stats.totalSets} sets
                          </span>
                          {stats.averageRpe > 0 && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {stats.averageRpe} RPE
                            </span>
                          )}
                        </div>
                        {session.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {session.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Detail Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        {selectedSession && <SessionDetailDialog session={selectedSession} />}
      </Dialog>
    </div>
  );
};

export default WorkoutHistory;