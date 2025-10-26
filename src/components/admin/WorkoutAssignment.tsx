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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  Clock,
  Target,
  Users,
  Send,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { WorkoutPlan, UserWorkoutAssignment } from "@/types/exercise";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin" | "trainer";
  status: "active" | "inactive" | "pending";
}

interface WorkoutAssignmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutPlans: WorkoutPlan[];
  users: User[];
  onAssign: (assignments: Partial<UserWorkoutAssignment>[]) => void;
}

const WorkoutAssignment: React.FC<WorkoutAssignmentProps> = ({
  open,
  onOpenChange,
  workoutPlans,
  users,
  onAssign,
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [step, setStep] = useState<"workout" | "users" | "details">("workout");

  const activeUsers = users.filter(user => user.role === "user" && user.status === "active");
  const selectedWorkoutPlan = workoutPlans.find(wp => wp.id === selectedWorkout);

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === activeUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(activeUsers.map(user => user.id));
    }
  };

  const handleAssign = () => {
    if (!selectedWorkout || selectedUsers.length === 0) return;

    const assignments: Partial<UserWorkoutAssignment>[] = selectedUsers.map(userId => ({
      userId,
      workoutPlanId: selectedWorkout,
      assignedBy: "Admin", // This would come from auth context
      assignedAt: new Date().toISOString(),
      scheduledDate: scheduledDate || undefined,
      status: "scheduled" as const,
      notes: assignmentNotes || undefined,
    }));

    onAssign(assignments);
    handleClose();
  };

  const handleClose = () => {
    setSelectedWorkout("");
    setSelectedUsers([]);
    setScheduledDate("");
    setAssignmentNotes("");
    setStep("workout");
    onOpenChange(false);
  };

  const canProceedToUsers = selectedWorkout !== "";
  const canProceedToDetails = selectedUsers.length > 0;
  const canAssign = selectedWorkout && selectedUsers.length > 0;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Workout to Users</DialogTitle>
          <DialogDescription>
            Select a workout plan and assign it to one or more users
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 py-4">
          <div className={`flex items-center space-x-2 ${step === "workout" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === "workout" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Select Workout</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center space-x-2 ${step === "users" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === "users" ? "bg-primary text-primary-foreground" : 
              canProceedToUsers ? "bg-green-100 text-green-800" : "bg-muted"
            }`}>
              {canProceedToUsers && step !== "users" ? <CheckCircle className="h-4 w-4" /> : "2"}
            </div>
            <span className="text-sm font-medium">Select Users</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center space-x-2 ${step === "details" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === "details" ? "bg-primary text-primary-foreground" : 
              canProceedToDetails ? "bg-green-100 text-green-800" : "bg-muted"
            }`}>
              {canProceedToDetails && step !== "details" ? <CheckCircle className="h-4 w-4" /> : "3"}
            </div>
            <span className="text-sm font-medium">Assignment Details</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Select Workout */}
          {step === "workout" && (
            <Card>
              <CardHeader>
                <CardTitle>Select Workout Plan</CardTitle>
                <CardDescription>
                  Choose a workout plan to assign to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workoutPlans.map((workout) => (
                    <div
                      key={workout.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedWorkout === workout.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedWorkout(workout.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{workout.name}</h3>
                            <Badge className={getDifficultyColor(workout.difficulty)}>
                              {workout.difficulty}
                            </Badge>
                            <Badge variant="outline">{workout.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {workout.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {workout.totalDuration} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {workout.exercises.length} exercises
                            </span>
                          </div>
                        </div>
                        {selectedWorkout === workout.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Users */}
          {step === "users" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Select Users</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllUsers}
                  >
                    {selectedUsers.length === activeUsers.length ? "Deselect All" : "Select All"}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Choose which users should receive this workout assignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.length === activeUsers.length}
                          onCheckedChange={handleSelectAllUsers}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleUserToggle(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt={user.name}
                              />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {user.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {selectedUsers.length > 0 && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Assignment Details */}
          {step === "details" && (
            <div className="space-y-6">
              {/* Assignment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{selectedWorkoutPlan?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedWorkoutPlan?.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {selectedWorkoutPlan?.totalDuration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {selectedWorkoutPlan?.exercises.length} exercises
                          </span>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(selectedWorkoutPlan?.difficulty || "")}>
                        {selectedWorkoutPlan?.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Assigning to {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Details Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Details</CardTitle>
                  <CardDescription>
                    Set scheduling and additional information for this assignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="scheduled-date">Scheduled Date (optional)</Label>
                    <Input
                      id="scheduled-date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="assignment-notes">Notes (optional)</Label>
                    <Textarea
                      id="assignment-notes"
                      value={assignmentNotes}
                      onChange={(e) => setAssignmentNotes(e.target.value)}
                      placeholder="Additional instructions or notes for the users..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              {step !== "workout" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === "users") setStep("workout");
                    if (step === "details") setStep("users");
                  }}
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              {step === "workout" && (
                <Button
                  onClick={() => setStep("users")}
                  disabled={!canProceedToUsers}
                >
                  Next: Select Users
                </Button>
              )}
              {step === "users" && (
                <Button
                  onClick={() => setStep("details")}
                  disabled={!canProceedToDetails}
                >
                  Next: Assignment Details
                </Button>
              )}
              {step === "details" && (
                <Button onClick={handleAssign} disabled={!canAssign}>
                  <Send className="mr-2 h-4 w-4" />
                  Assign Workout
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutAssignment;