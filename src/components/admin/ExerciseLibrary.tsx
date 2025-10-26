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
  DialogTrigger,
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
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Play,
  Clock,
  Users,
  Target,
  Dumbbell,
} from "lucide-react";
import { Exercise, ExerciseType } from "@/types/exercise";

interface ExerciseLibraryProps {
  onSelectExercise?: (exercise: Exercise) => void;
  selectionMode?: boolean;
  selectedExercises?: Exercise[];
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  onSelectExercise,
  selectionMode = false,
  selectedExercises = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ExerciseType | "all">("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Mock exercise data
  const exercises: Exercise[] = [
    {
      id: "1",
      name: "Push-ups",
      description: "Classic bodyweight exercise targeting chest, shoulders, and triceps",
      type: "strength",
      difficulty: "beginner",
      muscleGroups: ["chest", "shoulders", "triceps", "core"],
      equipment: ["bodyweight"],
      duration: 2,
      instructions: [
        "Start in a plank position with hands slightly wider than shoulders",
        "Lower your body until chest nearly touches the floor",
        "Push back up to starting position",
        "Keep your body in a straight line throughout"
      ],
      videoUrl: "https://example.com/pushups-video",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Burpees",
      description: "Full-body high-intensity exercise combining squat, plank, and jump",
      type: "hiit",
      difficulty: "advanced",
      muscleGroups: ["full body", "cardiovascular"],
      equipment: ["bodyweight"],
      duration: 1,
      instructions: [
        "Start standing with feet shoulder-width apart",
        "Drop into a squat and place hands on floor",
        "Jump feet back into plank position",
        "Do a push-up (optional)",
        "Jump feet back to squat position",
        "Explode up with arms overhead"
      ],
      videoUrl: "https://example.com/burpees-video",
      createdAt: "2024-01-02",
      updatedAt: "2024-01-02",
    },
    {
      id: "3",
      name: "Deadlifts",
      description: "Compound strength exercise targeting posterior chain muscles",
      type: "strength",
      difficulty: "intermediate",
      muscleGroups: ["hamstrings", "glutes", "lower back", "traps"],
      equipment: ["barbell", "weights"],
      duration: 3,
      instructions: [
        "Stand with feet hip-width apart, bar over mid-foot",
        "Bend at hips and knees to grip the bar",
        "Keep chest up and back straight",
        "Drive through heels to lift the bar",
        "Stand tall, then lower with control"
      ],
      videoUrl: "https://example.com/deadlifts-video",
      createdAt: "2024-01-03",
      updatedAt: "2024-01-03",
    },
    {
      id: "4",
      name: "Mountain Climbers",
      description: "Dynamic cardio exercise that targets core and improves cardiovascular fitness",
      type: "cardio",
      difficulty: "intermediate",
      muscleGroups: ["core", "shoulders", "legs"],
      equipment: ["bodyweight"],
      duration: 1,
      instructions: [
        "Start in plank position",
        "Bring right knee toward chest",
        "Quickly switch legs, bringing left knee toward chest",
        "Continue alternating legs rapidly",
        "Keep hips level and core engaged"
      ],
      videoUrl: "https://example.com/mountain-climbers-video",
      createdAt: "2024-01-04",
      updatedAt: "2024-01-04",
    },
    {
      id: "5",
      name: "Downward Dog",
      description: "Classic yoga pose that stretches and strengthens the entire body",
      type: "yoga",
      difficulty: "beginner",
      muscleGroups: ["shoulders", "hamstrings", "calves", "core"],
      equipment: ["yoga mat"],
      duration: 2,
      instructions: [
        "Start on hands and knees",
        "Tuck toes under and lift hips up and back",
        "Straighten legs as much as possible",
        "Press hands firmly into mat",
        "Create an inverted V shape with your body"
      ],
      videoUrl: "https://example.com/downward-dog-video",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-05",
    },
    {
      id: "6",
      name: "Squats",
      description: "Fundamental lower body exercise targeting quads, glutes, and core",
      type: "strength",
      difficulty: "beginner",
      muscleGroups: ["quadriceps", "glutes", "hamstrings", "core"],
      equipment: ["bodyweight"],
      duration: 2,
      instructions: [
        "Stand with feet shoulder-width apart",
        "Lower body by bending knees and pushing hips back",
        "Keep chest up and knees behind toes",
        "Lower until thighs are parallel to floor",
        "Push through heels to return to start"
      ],
      videoUrl: "https://example.com/squats-video",
      createdAt: "2024-01-06",
      updatedAt: "2024-01-06",
    },
  ];

  const exerciseTypes: { value: ExerciseType | "all"; label: string }[] = [
    { value: "all", label: "All Types" },
    { value: "cardio", label: "Cardio" },
    { value: "strength", label: "Strength" },
    { value: "flexibility", label: "Flexibility" },
    { value: "balance", label: "Balance" },
    { value: "hiit", label: "HIIT" },
    { value: "yoga", label: "Yoga" },
    { value: "pilates", label: "Pilates" },
    { value: "functional", label: "Functional" },
    { value: "sports", label: "Sports" },
  ];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || exercise.type === filterType;
    const matchesDifficulty = filterDifficulty === "all" || exercise.difficulty === filterDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      cardio: "bg-blue-100 text-blue-800",
      strength: "bg-purple-100 text-purple-800",
      flexibility: "bg-pink-100 text-pink-800",
      balance: "bg-indigo-100 text-indigo-800",
      hiit: "bg-orange-100 text-orange-800",
      yoga: "bg-green-100 text-green-800",
      pilates: "bg-teal-100 text-teal-800",
      functional: "bg-cyan-100 text-cyan-800",
      sports: "bg-red-100 text-red-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const handleExerciseAction = (exercise: Exercise) => {
    if (selectionMode && onSelectExercise) {
      onSelectExercise(exercise);
    } else {
      setSelectedExercise(exercise);
    }
  };

  const isExerciseSelected = (exercise: Exercise) => {
    return selectedExercises.some(selected => selected.id === exercise.id);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exercise Library</h2>
          <p className="text-muted-foreground">
            {selectionMode ? "Select exercises to add to workout" : "Manage your exercise database"}
          </p>
        </div>
        {!selectionMode && (
          <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Exercise</DialogTitle>
                <DialogDescription>
                  Create a new exercise for the library
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise-name">Exercise Name</Label>
                    <Input id="exercise-name" placeholder="e.g., Push-ups" />
                  </div>
                  <div>
                    <Label htmlFor="exercise-type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseTypes.slice(1).map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="exercise-description">Description</Label>
                  <Textarea 
                    id="exercise-description" 
                    placeholder="Brief description of the exercise"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise-difficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="exercise-duration">Duration (minutes)</Label>
                    <Input 
                      id="exercise-duration" 
                      type="number" 
                      placeholder="2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="video-url">Video URL (optional)</Label>
                  <Input 
                    id="video-url" 
                    placeholder="https://example.com/exercise-video"
                  />
                </div>
                <div>
                  <Label htmlFor="muscle-groups">Muscle Groups</Label>
                  <Input 
                    id="muscle-groups" 
                    placeholder="chest, shoulders, triceps (comma separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="equipment">Equipment</Label>
                  <Input 
                    id="equipment" 
                    placeholder="bodyweight, dumbbells (comma separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea 
                    id="instructions" 
                    placeholder="Step-by-step instructions (one per line)"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setExerciseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setExerciseDialogOpen(false)}>
                  Add Exercise
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as ExerciseType | "all")}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exerciseTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Exercises ({filteredExercises.length})
          </CardTitle>
          <CardDescription>
            {selectionMode ? "Click to select exercises" : "Manage your exercise library"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Muscle Groups</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.map((exercise) => (
                <TableRow 
                  key={exercise.id}
                  className={`${selectionMode ? 'cursor-pointer hover:bg-muted/50' : ''} ${
                    isExerciseSelected(exercise) ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => selectionMode && handleExerciseAction(exercise)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {exercise.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(exercise.type)}>
                      {exercise.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {exercise.duration}m
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscleGroups.slice(0, 2).map((group) => (
                        <Badge key={group} variant="outline" className="text-xs">
                          {group}
                        </Badge>
                      ))}
                      {exercise.muscleGroups.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{exercise.muscleGroups.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {selectionMode ? (
                        <Button
                          size="sm"
                          variant={isExerciseSelected(exercise) ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExerciseAction(exercise);
                          }}
                        >
                          {isExerciseSelected(exercise) ? "Selected" : "Select"}
                        </Button>
                      ) : (
                        <>
                          {exercise.videoUrl && (
                            <Button variant="ghost" size="icon">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Exercise Detail Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-2xl">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  {selectedExercise.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedExercise.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge className={getTypeColor(selectedExercise.type)}>
                    {selectedExercise.type}
                  </Badge>
                  <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                    {selectedExercise.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedExercise.duration}m
                  </Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Muscle Groups</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedExercise.muscleGroups.map((group) => (
                      <Badge key={group} variant="outline">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Equipment</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedExercise.equipment.map((item) => (
                      <Badge key={item} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                {selectedExercise.videoUrl && (
                  <div>
                    <h4 className="font-medium mb-2">Video</h4>
                    <Button variant="outline" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Exercise Video
                    </Button>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedExercise(null)}>
                  Close
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Exercise
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExerciseLibrary;