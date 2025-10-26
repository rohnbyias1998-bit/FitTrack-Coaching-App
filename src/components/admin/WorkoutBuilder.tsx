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
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Target,
  Save,
  X,
} from "lucide-react";
import { Exercise, WorkoutPlan, WorkoutExercise } from "@/types/exercise";
import ExerciseLibrary from "./ExerciseLibrary";

interface WorkoutBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (workout: Partial<WorkoutPlan>) => void;
  editingWorkout?: WorkoutPlan | null;
}

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  open,
  onOpenChange,
  onSave,
  editingWorkout,
}) => {
  const [workoutName, setWorkoutName] = useState(editingWorkout?.name || "");
  const [workoutDescription, setWorkoutDescription] = useState(editingWorkout?.description || "");
  const [workoutDifficulty, setWorkoutDifficulty] = useState<"beginner" | "intermediate" | "advanced">(
    editingWorkout?.difficulty || "beginner"
  );
  const [workoutType, setWorkoutType] = useState(editingWorkout?.type || "");
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(
    editingWorkout?.exercises || []
  );
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);

  const handleAddExercise = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exercise,
      sets: 3,
      reps: 10,
      duration: exercise.duration ? exercise.duration * 60 : undefined,
      restTime: 60,
      order: selectedExercises.length + 1,
    };
    setSelectedExercises([...selectedExercises, newWorkoutExercise]);
    setShowExerciseLibrary(false);
  };

  const handleRemoveExercise = (index: number) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    // Reorder remaining exercises
    const reordered = updated.map((ex, i) => ({ ...ex, order: i + 1 }));
    setSelectedExercises(reordered);
  };

  const handleUpdateExercise = (index: number, updates: Partial<WorkoutExercise>) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], ...updates };
    setSelectedExercises(updated);
  };

  const calculateTotalDuration = () => {
    return selectedExercises.reduce((total, ex) => {
      const exerciseDuration = ex.duration || (ex.sets && ex.reps ? ex.sets * 30 : 0);
      const restDuration = ex.restTime || 0;
      return total + exerciseDuration + restDuration;
    }, 0);
  };

  const handleSave = () => {
    const workout: Partial<WorkoutPlan> = {
      name: workoutName,
      description: workoutDescription,
      difficulty: workoutDifficulty,
      type: workoutType,
      exercises: selectedExercises,
      totalDuration: Math.round(calculateTotalDuration() / 60), // Convert to minutes
      createdBy: "Admin", // This would come from auth context
      createdAt: new Date().toISOString(),
    };
    onSave(workout);
    handleClose();
  };

  const handleClose = () => {
    setWorkoutName("");
    setWorkoutDescription("");
    setWorkoutDifficulty("beginner");
    setWorkoutType("");
    setSelectedExercises([]);
    onOpenChange(false);
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWorkout ? "Edit Workout Plan" : "Create New Workout Plan"}
            </DialogTitle>
            <DialogDescription>
              Build a custom workout by adding exercises from the library
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>
              <div>
                <Label htmlFor="workout-type">Workout Type</Label>
                <Input
                  id="workout-type"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  placeholder="e.g., Strength, Cardio, HIIT"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="workout-description">Description</Label>
              <Textarea
                id="workout-description"
                value={workoutDescription}
                onChange={(e) => setWorkoutDescription(e.target.value)}
                placeholder="Brief description of the workout"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="workout-difficulty">Difficulty</Label>
                <Select value={workoutDifficulty} onValueChange={(value: any) => setWorkoutDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Total Duration</Label>
                <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {Math.round(calculateTotalDuration() / 60)} minutes
                </div>
              </div>
              <div>
                <Label>Exercises</Label>
                <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                  <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                  {selectedExercises.length} exercises
                </div>
              </div>
            </div>

            <Separator />

            {/* Exercise List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Exercises</h3>
                <Button onClick={() => setShowExerciseLibrary(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Exercise
                </Button>
              </div>

              {selectedExercises.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No exercises added yet</p>
                      <p className="text-sm">Click "Add Exercise" to get started</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {selectedExercises.map((workoutExercise, index) => (
                    <Card key={`${workoutExercise.exerciseId}-${index}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GripVertical className="h-4 w-4" />
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{workoutExercise.exercise.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {workoutExercise.exercise.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveExercise(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <Label className="text-xs">Sets</Label>
                                <Input
                                  type="number"
                                  value={workoutExercise.sets || ""}
                                  onChange={(e) => handleUpdateExercise(index, { sets: parseInt(e.target.value) || undefined })}
                                  placeholder="3"
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Reps</Label>
                                <Input
                                  type="number"
                                  value={workoutExercise.reps || ""}
                                  onChange={(e) => handleUpdateExercise(index, { reps: parseInt(e.target.value) || undefined })}
                                  placeholder="10"
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Duration (sec)</Label>
                                <Input
                                  type="number"
                                  value={workoutExercise.duration || ""}
                                  onChange={(e) => handleUpdateExercise(index, { duration: parseInt(e.target.value) || undefined })}
                                  placeholder="60"
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Rest (sec)</Label>
                                <Input
                                  type="number"
                                  value={workoutExercise.restTime || ""}
                                  onChange={(e) => handleUpdateExercise(index, { restTime: parseInt(e.target.value) || undefined })}
                                  placeholder="60"
                                  className="h-8"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-xs">Notes (optional)</Label>
                              <Input
                                value={workoutExercise.notes || ""}
                                onChange={(e) => handleUpdateExercise(index, { notes: e.target.value })}
                                placeholder="Special instructions..."
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!workoutName || !workoutType || selectedExercises.length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              {editingWorkout ? "Update Workout" : "Create Workout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exercise Library Modal */}
      <Dialog open={showExerciseLibrary} onOpenChange={setShowExerciseLibrary}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Exercise to Workout</DialogTitle>
            <DialogDescription>
              Select exercises from the library to add to your workout
            </DialogDescription>
          </DialogHeader>
          <ExerciseLibrary
            selectionMode={true}
            onSelectExercise={handleAddExercise}
            selectedExercises={selectedExercises.map(we => we.exercise)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutBuilder;