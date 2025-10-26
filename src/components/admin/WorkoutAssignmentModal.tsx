import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Dumbbell, Users, CheckCircle } from "lucide-react";
import { mockClients } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";

interface WorkoutAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  exerciseCount: number;
  duration: number; // in minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
}

const workoutTemplates: WorkoutTemplate[] = [
  {
    id: "1",
    name: "Upper Body Strength",
    exerciseCount: 8,
    duration: 45,
    difficulty: "intermediate",
    description: "Focus on chest, back, shoulders, and arms",
  },
  {
    id: "2",
    name: "Lower Body Hypertrophy",
    exerciseCount: 10,
    duration: 60,
    difficulty: "advanced",
    description: "High volume leg day for muscle growth",
  },
  {
    id: "3",
    name: "Full Body Beginner",
    exerciseCount: 6,
    duration: 30,
    difficulty: "beginner",
    description: "Perfect for those new to strength training",
  },
  {
    id: "4",
    name: "Calisthenics Skills Practice",
    exerciseCount: 7,
    duration: 40,
    difficulty: "intermediate",
    description: "Bodyweight movements and skill progressions",
  },
  {
    id: "5",
    name: "Push Day",
    exerciseCount: 9,
    duration: 50,
    difficulty: "intermediate",
    description: "Chest, shoulders, and triceps focused workout",
  },
  {
    id: "6",
    name: "Pull Day",
    exerciseCount: 9,
    duration: 50,
    difficulty: "intermediate",
    description: "Back and biceps focused workout",
  },
  {
    id: "7",
    name: "Leg Day Power",
    exerciseCount: 8,
    duration: 55,
    difficulty: "advanced",
    description: "Heavy compound movements for lower body strength",
  },
  {
    id: "8",
    name: "Core & Conditioning",
    exerciseCount: 12,
    duration: 35,
    difficulty: "beginner",
    description: "Abs, core stability, and cardio conditioning",
  },
  {
    id: "9",
    name: "Olympic Lifting Technique",
    exerciseCount: 5,
    duration: 45,
    difficulty: "advanced",
    description: "Clean, snatch, and jerk progressions",
  },
  {
    id: "10",
    name: "Active Recovery & Mobility",
    exerciseCount: 8,
    duration: 25,
    difficulty: "beginner",
    description: "Light movement, stretching, and mobility work",
  },
];

const WorkoutAssignmentModal: React.FC<WorkoutAssignmentModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
}) => {
  const { toast } = useToast();
  const [workoutType, setWorkoutType] = useState<
    "template" | "custom" | "copy"
  >("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customWorkoutName, setCustomWorkoutName] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedWorkout, setSelectedWorkout] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [weeksCount, setWeeksCount] = useState("4");
  const [sendNotification, setSendNotification] = useState(true);
  const [notes, setNotes] = useState("");

  const selectedTemplateData = workoutTemplates.find(
    (t) => t.id === selectedTemplate
  );

  const otherClients = mockClients.filter((c) => c.id !== clientId);

  const handleSubmit = () => {
    // Validation
    if (workoutType === "template" && !selectedTemplate) {
      toast({
        title: "Validation Error",
        description: "Please select a workout template",
        variant: "destructive",
      });
      return;
    }

    if (workoutType === "custom" && !customWorkoutName) {
      toast({
        title: "Validation Error",
        description: "Please enter a workout name",
        variant: "destructive",
      });
      return;
    }

    if (workoutType === "copy" && (!selectedClient || !selectedWorkout)) {
      toast({
        title: "Validation Error",
        description: "Please select a client and workout to copy",
        variant: "destructive",
      });
      return;
    }

    if (!scheduledDate) {
      toast({
        title: "Validation Error",
        description: "Please select a date for the workout",
        variant: "destructive",
      });
      return;
    }

    // Log assignment details
    const assignmentData = {
      clientId,
      clientName,
      workoutType,
      workout:
        workoutType === "template"
          ? selectedTemplateData
          : workoutType === "custom"
          ? { name: customWorkoutName }
          : { copiedFrom: selectedClient, workoutId: selectedWorkout },
      scheduledDate,
      repeatWeekly,
      weeksCount: repeatWeekly ? weeksCount : null,
      sendNotification,
      notes,
    };

    console.log("Workout Assignment:", assignmentData);

    // Show success message
    toast({
      title: "Workout Assigned Successfully",
      description: `${
        workoutType === "template"
          ? selectedTemplateData?.name
          : customWorkoutName
      } has been assigned to ${clientName}`,
    });

    // Reset form and close
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setWorkoutType("template");
    setSelectedTemplate("");
    setCustomWorkoutName("");
    setSelectedClient("");
    setSelectedWorkout("");
    setScheduledDate("");
    setRepeatWeekly(false);
    setWeeksCount("4");
    setSendNotification(true);
    setNotes("");
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Assign Workout to {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Select Workout Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Step 1: Select Workout Type
            </Label>
            <RadioGroup value={workoutType} onValueChange={setWorkoutType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="template" id="template" />
                <Label htmlFor="template" className="cursor-pointer">
                  Use Existing Template
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="cursor-pointer">
                  Build Custom Workout
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="copy" id="copy" />
                <Label htmlFor="copy" className="cursor-pointer">
                  Copy from Another Client
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t pt-6" />

          {/* Step 2: Workout Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Step 2: Workout Selection
            </Label>

            {workoutType === "template" && (
              <div className="space-y-4">
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workout template" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedTemplateData && (
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">
                            {selectedTemplateData.name}
                          </h4>
                          <Badge
                            className={getDifficultyColor(
                              selectedTemplateData.difficulty
                            )}
                          >
                            {selectedTemplateData.difficulty
                              .charAt(0)
                              .toUpperCase() +
                              selectedTemplateData.difficulty.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {selectedTemplateData.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-4 w-4" />
                            <span>
                              {selectedTemplateData.exerciseCount} exercises
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{selectedTemplateData.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {workoutType === "custom" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workoutName">Workout Name</Label>
                  <Input
                    id="workoutName"
                    placeholder="e.g., Custom Upper Body"
                    value={customWorkoutName}
                    onChange={(e) => setCustomWorkoutName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Add Exercises
                </Button>
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-gray-500">
                      <Dumbbell className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm">No exercises added yet</p>
                      <p className="text-xs mt-1">
                        Click "Add Exercises" to build your workout
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {workoutType === "copy" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="selectClient">Select Client</Label>
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                  >
                    <SelectTrigger id="selectClient" className="mt-1">
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {otherClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedClient && (
                  <div>
                    <Label htmlFor="selectWorkout">Select Workout</Label>
                    <Select
                      value={selectedWorkout}
                      onValueChange={setSelectedWorkout}
                    >
                      <SelectTrigger id="selectWorkout" className="mt-1">
                        <SelectValue placeholder="Choose a workout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workout-1">
                          Upper Body Strength - March 15
                        </SelectItem>
                        <SelectItem value="workout-2">
                          Lower Body Power - March 13
                        </SelectItem>
                        <SelectItem value="workout-3">
                          Full Body Circuit - March 10
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedWorkout && (
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold">
                          Upper Body Strength
                        </h4>
                        <p className="text-sm text-gray-600">
                          8 exercises • 45 minutes
                        </p>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Completed on March 15, 2024</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          <div className="border-t pt-6" />

          {/* Step 3: Schedule */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Step 3: Schedule
            </Label>

            <div>
              <Label htmlFor="scheduledDate">
                When should they do this workout?
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="repeatWeekly"
                checked={repeatWeekly}
                onCheckedChange={(checked) =>
                  setRepeatWeekly(checked as boolean)
                }
              />
              <Label htmlFor="repeatWeekly" className="cursor-pointer">
                Repeat weekly
              </Label>
            </div>

            {repeatWeekly && (
              <div className="ml-6">
                <Label htmlFor="weeksCount">For how many weeks?</Label>
                <Input
                  id="weeksCount"
                  type="number"
                  min="1"
                  max="52"
                  value={weeksCount}
                  onChange={(e) => setWeeksCount(e.target.value)}
                  className="mt-1 w-32"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendNotification"
                checked={sendNotification}
                onCheckedChange={(checked) =>
                  setSendNotification(checked as boolean)
                }
              />
              <Label htmlFor="sendNotification" className="cursor-pointer">
                Send notification when assigned
              </Label>
            </div>
          </div>

          <div className="border-t pt-6" />

          {/* Step 4: Notes */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Step 4: Notes (Optional)
            </Label>
            <div>
              <Textarea
                placeholder="Add instructions or notes for this client..."
                value={notes}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setNotes(e.target.value);
                  }
                }}
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {notes.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Calendar className="mr-2 h-4 w-4" />
            Assign Workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutAssignmentModal;
