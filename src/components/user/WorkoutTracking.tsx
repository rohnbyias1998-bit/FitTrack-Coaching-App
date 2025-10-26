import React, { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  Square,
  Plus,
  Minus,
  Clock,
  Target,
  CheckCircle,
  SkipForward,
  Save,
  Timer,
  Weight,
  RotateCcw,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  WorkoutSession,
  ExerciseLog,
  SetLog,
  WorkoutPlan,
  Exercise,
  WorkoutProgress,
  WeeklyProgress,
  Milestone,
} from "@/types/exercise";

interface WorkoutTrackingProps {
  workoutPlan: WorkoutPlan;
  onComplete: (session: WorkoutSession) => void;
  onCancel: () => void;
}

const WorkoutTracking: React.FC<WorkoutTrackingProps> = ({
  workoutPlan,
  onComplete,
  onCancel,
}) => {
  const [session, setSession] = useState<WorkoutSession>({
    id: `session-${Date.now()}`,
    userId: 1, // This would come from auth context
    workoutPlanId: workoutPlan.id,
    startedAt: new Date().toISOString(),
    status: "in-progress",
    exercises: workoutPlan.exercises.map((we, index) => ({
      id: `exercise-log-${index}`,
      sessionId: `session-${Date.now()}`,
      exerciseId: we.exerciseId,
      exercise: we.exercise,
      plannedSets: we.sets,
      plannedReps: we.reps,
      plannedDuration: we.duration,
      completedSets: [],
      skipped: false,
      notes: "",
    })),
    notes: "",
  });

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  // Timer effects
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkoutTimer(prev => prev + 1);
      if (isResting && restTimer > 0) {
        setRestTimer(prev => prev - 1);
      } else if (isResting && restTimer === 0) {
        setIsResting(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const currentExercise = session.exercises[currentExerciseIndex];
  const completedExercises = session.exercises.filter(e => 
    e.completedSets.length > 0 || e.skipped
  ).length;
  const progressPercentage = (completedExercises / session.exercises.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addSet = (exerciseIndex: number) => {
    const exercise = session.exercises[exerciseIndex];
    const setNumber = exercise.completedSets.length + 1;
    
    const newSet: SetLog = {
      id: `set-${Date.now()}`,
      setNumber,
      reps: exercise.plannedReps || 0,
      weight: 0,
      duration: exercise.plannedDuration || 0,
      rpe: 5,
      completedAt: new Date().toISOString(),
    };

    setSession(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, idx) => 
        idx === exerciseIndex 
          ? { ...ex, completedSets: [...ex.completedSets, newSet] }
          : ex
      )
    }));
  };

  const updateSet = (exerciseIndex: number, setIndex: number, updates: Partial<SetLog>) => {
    setSession(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, exIdx) => 
        exIdx === exerciseIndex 
          ? {
              ...ex,
              completedSets: ex.completedSets.map((set, setIdx) =>
                setIdx === setIndex ? { ...set, ...updates } : set
              )
            }
          : ex
      )
    }));
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setSession(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, exIdx) => 
        exIdx === exerciseIndex 
          ? {
              ...ex,
              completedSets: ex.completedSets.filter((_, setIdx) => setIdx !== setIndex)
            }
          : ex
      )
    }));
  };

  const skipExercise = (exerciseIndex: number) => {
    setSession(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, idx) => 
        idx === exerciseIndex ? { ...ex, skipped: true } : ex
      )
    }));
    
    if (exerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1);
    }
  };

  const startRest = (duration: number = 60) => {
    setRestTimer(duration);
    setIsResting(true);
  };

  const completeWorkout = () => {
    const completedSession: WorkoutSession = {
      ...session,
      status: "completed",
      completedAt: new Date().toISOString(),
      totalDuration: workoutTimer,
    };
    
    onComplete(completedSession);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowCompleteDialog(true);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{workoutPlan.name}</CardTitle>
                <CardDescription>{workoutPlan.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold">
                  {formatTime(workoutTimer)}
                </div>
                <p className="text-sm text-muted-foreground">Workout Time</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{completedExercises}/{session.exercises.length} exercises</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Rest Timer */}
        {isResting && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-orange-600 mb-2">
                  {formatTime(restTimer)}
                </div>
                <p className="text-orange-700 mb-4">Rest Time Remaining</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsResting(false)}
                  className="border-orange-300"
                >
                  Skip Rest
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Exercise */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {currentExerciseIndex + 1}
                  </span>
                  {currentExercise.exercise.name}
                </CardTitle>
                <CardDescription>{currentExercise.exercise.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousExercise}
                  disabled={currentExerciseIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => skipExercise(currentExerciseIndex)}
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Skip
                </Button>
                <Button
                  size="sm"
                  onClick={nextExercise}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exercise Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {currentExercise.plannedSets && (
                <div>
                  <span className="text-muted-foreground">Target Sets:</span>
                  <p className="font-medium">{currentExercise.plannedSets}</p>
                </div>
              )}
              {currentExercise.plannedReps && (
                <div>
                  <span className="text-muted-foreground">Target Reps:</span>
                  <p className="font-medium">{currentExercise.plannedReps}</p>
                </div>
              )}
              {currentExercise.plannedDuration && (
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">{Math.floor(currentExercise.plannedDuration / 60)}:{(currentExercise.plannedDuration % 60).toString().padStart(2, '0')}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Muscle Groups:</span>
                <p className="font-medium">{currentExercise.exercise.muscleGroups.slice(0, 2).join(", ")}</p>
              </div>
            </div>

            <Separator />

            {/* Sets Tracking */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Sets</h3>
                <Button
                  size="sm"
                  onClick={() => addSet(currentExerciseIndex)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Set
                </Button>
              </div>

              {currentExercise.completedSets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No sets completed yet</p>
                  <p className="text-sm">Click "Add Set" to start tracking</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentExercise.completedSets.map((set, setIndex) => (
                    <Card key={set.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <span className="text-sm font-medium">{set.setNumber}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
                          {currentExercise.exercise.type === "strength" && (
                            <>
                              <div>
                                <Label className="text-xs">Weight (lbs)</Label>
                                <Input
                                  type="number"
                                  value={set.weight || ""}
                                  onChange={(e) => updateSet(currentExerciseIndex, setIndex, { 
                                    weight: parseFloat(e.target.value) || 0 
                                  })}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Reps</Label>
                                <Input
                                  type="number"
                                  value={set.reps || ""}
                                  onChange={(e) => updateSet(currentExerciseIndex, setIndex, { 
                                    reps: parseInt(e.target.value) || 0 
                                  })}
                                  className="h-8"
                                />
                              </div>
                            </>
                          )}
                          
                          {(currentExercise.exercise.type === "cardio" || currentExercise.exercise.type === "hiit") && (
                            <div>
                              <Label className="text-xs">Duration (sec)</Label>
                              <Input
                                type="number"
                                value={set.duration || ""}
                                onChange={(e) => updateSet(currentExerciseIndex, setIndex, { 
                                  duration: parseInt(e.target.value) || 0 
                                })}
                                className="h-8"
                              />
                            </div>
                          )}
                          
                          <div>
                            <Label className="text-xs">RPE (1-10)</Label>
                            <Select
                              value={set.rpe?.toString() || "5"}
                              onValueChange={(value) => updateSet(currentExerciseIndex, setIndex, { 
                                rpe: parseInt(value) 
                              })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Rest (sec)</Label>
                            <Input
                              type="number"
                              value={set.restTime || ""}
                              onChange={(e) => updateSet(currentExerciseIndex, setIndex, { 
                                restTime: parseInt(e.target.value) || 0 
                              })}
                              className="h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          {set.restTime && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startRest(set.restTime)}
                            >
                              <Timer className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSet(currentExerciseIndex, setIndex)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Exercise Notes */}
            <div>
              <Label className="text-sm font-medium">Exercise Notes</Label>
              <Textarea
                value={currentExercise.notes || ""}
                onChange={(e) => setSession(prev => ({
                  ...prev,
                  exercises: prev.exercises.map((ex, idx) => 
                    idx === currentExerciseIndex 
                      ? { ...ex, notes: e.target.value }
                      : ex
                  )
                }))}
                placeholder="Add notes about this exercise..."
                className="mt-1"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Exercise List Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Workout Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {session.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    index === currentExerciseIndex 
                      ? "border-primary bg-primary/5" 
                      : exercise.completedSets.length > 0 || exercise.skipped
                        ? "border-green-200 bg-green-50"
                        : "border-border"
                  }`}
                  onClick={() => setCurrentExerciseIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      exercise.skipped 
                        ? "bg-gray-200 text-gray-600"
                        : exercise.completedSets.length > 0
                          ? "bg-green-100 text-green-700"
                          : index === currentExerciseIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                    }`}>
                      {exercise.skipped ? "S" : exercise.completedSets.length > 0 ? "✓" : index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{exercise.exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.skipped 
                          ? "Skipped"
                          : exercise.completedSets.length > 0
                            ? `${exercise.completedSets.length} sets completed`
                            : `${exercise.plannedSets || 0} sets planned`
                        }
                      </p>
                    </div>
                  </div>
                  {index === currentExerciseIndex && (
                    <Badge>Current</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Complete Workout Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button
                className="flex-1"
                size="lg"
                onClick={() => setShowCompleteDialog(true)}
                disabled={completedExercises === 0}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Complete Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complete Workout Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Workout</DialogTitle>
            <DialogDescription>
              Great job! Add any final notes about your workout.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium">{formatTime(workoutTimer)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Exercises:</span>
                <p className="font-medium">{completedExercises}/{session.exercises.length}</p>
              </div>
            </div>
            <div>
              <Label>Workout Notes</Label>
              <Textarea
                value={session.notes || ""}
                onChange={(e) => setSession(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="How did the workout feel? Any observations..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Continue Workout
            </Button>
            <Button onClick={completeWorkout}>
              <Save className="mr-2 h-4 w-4" />
              Complete Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutTracking;