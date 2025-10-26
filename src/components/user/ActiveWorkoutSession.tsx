import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Timer,
  Trophy,
  Star,
  History
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { WorkoutPlan, WorkoutSession, ExerciseLog, SetLog } from '@/types/exercise';
import MuscleVisualization from '@/components/user/MuscleVisualization';

interface ActiveWorkoutSessionProps {
  workoutPlan: WorkoutPlan;
  onComplete: (session: WorkoutSession) => void;
  onCancel: () => void;
  onViewExerciseHistory?: (exerciseId: string) => void;
}

interface SetData {
  setNumber: number;
  reps: number | null;
  weight: number | null;
  duration: number | null;
  completed: boolean;
  restTime: number;
}

interface ExerciseData {
  exerciseId: string;
  sets: SetData[];
  notes: string;
  expanded: boolean;
}

export default function ActiveWorkoutSession({ 
  workoutPlan, 
  onComplete, 
  onCancel,
  onViewExerciseHistory
}: ActiveWorkoutSessionProps) {
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [activeRestExercise, setActiveRestExercise] = useState<string | null>(null);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [showSummary, setShowSummary] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Initialize exercise data
  const [exerciseData, setExerciseData] = useState<Record<string, ExerciseData>>(() => {
    const data: Record<string, ExerciseData> = {};
    workoutPlan.exercises.forEach((ex) => {
      const sets: SetData[] = [];
      const numSets = ex.sets || 3;
      for (let i = 0; i < numSets; i++) {
        sets.push({
          setNumber: i + 1,
          reps: ex.reps || null,
          weight: null,
          duration: ex.duration || null,
          completed: false,
          restTime: ex.restTime || 90,
        });
      }
      data[ex.exerciseId] = {
        exerciseId: ex.exerciseId,
        sets,
        notes: '',
        expanded: false,
      };
    });
    return data;
  });

  // Workout timer
  useEffect(() => {
    if (!isPaused && !showSummary) {
      const interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused, showSummary]);

  // Rest timer
  useEffect(() => {
    if (restTimer !== null && restTimer > 0) {
      const interval = setInterval(() => {
        setRestTimer(prev => (prev !== null && prev > 0 ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(interval);
    } else if (restTimer === 0) {
      // Rest complete - play alert
      setRestTimer(null);
      setActiveRestExercise(null);
    }
  }, [restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExercise = (exerciseId: string) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        expanded: !prev[exerciseId].expanded,
      },
    }));
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof SetData, value: any) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      const newSets = [...exercise.sets];
      newSets[setIndex] = { ...newSets[setIndex], [field]: value };
      return {
        ...prev,
        [exerciseId]: { ...exercise, sets: newSets },
      };
    });
  };

  const completeSet = (exerciseId: string, setIndex: number) => {
    const exercise = exerciseData[exerciseId];
    const set = exercise.sets[setIndex];
    
    updateSet(exerciseId, setIndex, 'completed', !set.completed);
    
    // Start rest timer if completing the set
    if (!set.completed) {
      setRestTimer(set.restTime);
      setActiveRestExercise(exerciseId);
    }
  };

  const startRestTimer = (exerciseId: string, restTime: number) => {
    setRestTimer(restTime);
    setActiveRestExercise(exerciseId);
  };

  const skipRest = () => {
    setRestTimer(null);
    setActiveRestExercise(null);
  };

  const addRestTime = () => {
    if (restTimer !== null) {
      setRestTimer(prev => (prev !== null ? prev + 30 : 30));
    }
  };

  const updateExerciseNotes = (exerciseId: string, notes: string) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], notes },
    }));
  };

  const calculateProgress = () => {
    let totalSets = 0;
    let completedSets = 0;
    
    Object.values(exerciseData).forEach(exercise => {
      totalSets += exercise.sets.length;
      completedSets += exercise.sets.filter(s => s.completed).length;
    });
    
    return { totalSets, completedSets, percentage: totalSets > 0 ? (completedSets / totalSets) * 100 : 0 };
  };

  const calculateTotalVolume = () => {
    let volume = 0;
    Object.values(exerciseData).forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed && set.weight && set.reps) {
          volume += set.weight * set.reps;
        }
      });
    });
    return volume;
  };

  const handleEndWorkout = () => {
    setShowSummary(true);
  };

  const handleSaveWorkout = () => {
    const progress = calculateProgress();
    const totalVolume = calculateTotalVolume();
    
    // Build exercise logs
    const exerciseLogs: ExerciseLog[] = workoutPlan.exercises.map(ex => {
      const exData = exerciseData[ex.exerciseId];
      const completedSets: SetLog[] = exData.sets
        .filter(s => s.completed)
        .map(s => ({
          id: `set-${Date.now()}-${s.setNumber}`,
          setNumber: s.setNumber,
          reps: s.reps || undefined,
          weight: s.weight || undefined,
          duration: s.duration || undefined,
          restTime: s.restTime,
          completedAt: new Date().toISOString(),
        }));

      return {
        id: `ex-log-${Date.now()}-${ex.exerciseId}`,
        sessionId: `session-${Date.now()}`,
        exerciseId: ex.exerciseId,
        exercise: ex.exercise,
        completedSets,
        notes: exData.notes,
        skipped: completedSets.length === 0,
      };
    });

    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      userId: 1,
      workoutPlanId: workoutPlan.id,
      startedAt: new Date(Date.now() - workoutTimer * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      status: 'completed',
      totalDuration: workoutTimer,
      notes: workoutNotes,
      exercises: exerciseLogs,
    };

    onComplete(session);
  };

  const progress = calculateProgress();
  const isBodyweight = (exerciseId: string) => {
    const exercise = workoutPlan.exercises.find(e => e.exerciseId === exerciseId);
    return exercise?.exercise.equipment.includes('bodyweight');
  };

  // Get previous performance (mock data)
  const getPreviousPerformance = (exerciseId: string) => {
    return {
      lastWorkout: '3×10 @ 135 lbs (7 days ago)',
      personalRecord: '3×12 @ 145 lbs',
    };
  };

  // Calculate recovery warnings
  const getRecoveryWarnings = () => {
    const warnings: string[] = [];
    const muscleGroups = new Set<string>();
    
    workoutPlan.exercises.forEach(ex => {
      ex.exercise.muscleGroups.forEach(muscle => {
        muscleGroups.add(muscle.toLowerCase());
      });
    });

    // This would ideally check against actual workout history
    // For now, show a general warning
    if (muscleGroups.size > 0) {
      return Array.from(muscleGroups).slice(0, 3); // Show first 3 muscle groups
    }
    return [];
  };

  const recoveryWarnings = getRecoveryWarnings();

  if (showSummary) {
    const totalVolume = calculateTotalVolume();
    const completedExercises = Object.values(exerciseData).filter(e => 
      e.sets.some(s => s.completed)
    ).length;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Workout Complete!</h2>
              <p className="text-gray-600">Great job finishing your workout</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold">{formatTime(workoutTimer)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Exercises</p>
                <p className="text-2xl font-bold">{completedExercises}/{workoutPlan.exercises.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Sets</p>
                <p className="text-2xl font-bold">{progress.completedSets}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Volume</p>
                <p className="text-2xl font-bold">{totalVolume.toLocaleString()} {weightUnit}</p>
              </div>
            </div>

            {/* Muscle Visualization */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Muscles Worked</h3>
              <MuscleVisualization 
                workoutHistory={[]}
                selectedSession={{
                  id: `session-${Date.now()}`,
                  userId: 1,
                  workoutPlanId: workoutPlan.id,
                  startedAt: new Date(Date.now() - workoutTimer * 1000).toISOString(),
                  completedAt: new Date().toISOString(),
                  status: 'completed',
                  totalDuration: workoutTimer,
                  exercises: workoutPlan.exercises.map(ex => {
                    const exData = exerciseData[ex.exerciseId];
                    return {
                      id: `ex-log-${ex.exerciseId}`,
                      sessionId: `session-${Date.now()}`,
                      exerciseId: ex.exerciseId,
                      exercise: ex.exercise,
                      completedSets: exData.sets
                        .filter(s => s.completed)
                        .map((s, idx) => ({
                          id: `set-${idx}`,
                          setNumber: s.setNumber,
                          reps: s.reps || undefined,
                          weight: s.weight || undefined,
                          duration: s.duration || undefined,
                          restTime: s.restTime,
                          completedAt: new Date().toISOString(),
                        })),
                      notes: exData.notes,
                      skipped: exData.sets.filter(s => s.completed).length === 0,
                    };
                  }),
                }}
                showRecovery={false}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">How did you feel?</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setUserRating(rating)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= userRating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Workout Notes (Optional)</label>
              <Textarea
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="How was your workout? Any observations?"
                rows={3}
              />
            </div>

            <Button onClick={handleSaveWorkout} className="w-full" size="lg">
              Save Workout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold">{workoutPlan.name}</h1>
              <p className="text-sm text-gray-600">
                {progress.completedSets} / {progress.totalSets} sets completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-4">
                <div className="text-2xl font-bold font-mono">{formatTime(workoutTimer)}</div>
                <div className="text-xs text-gray-600">Workout Time</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>
      </div>

      {/* Recovery Warning (if applicable) */}
      {recoveryWarnings.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-800">
              <strong>Recovery Notice:</strong> This workout targets {recoveryWarnings.join(', ')}. 
              Make sure these muscle groups have recovered adequately. Listen to your body and adjust intensity if needed.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Rest Timer Overlay */}
      {restTimer !== null && restTimer > 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-20 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="text-center">
            <Timer className="h-8 w-8 mx-auto mb-2" />
            <div className="text-3xl font-bold font-mono mb-1">{formatTime(restTimer)}</div>
            <p className="text-sm mb-3">Rest Time Remaining</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={skipRest}>
                Skip Rest
              </Button>
              <Button size="sm" variant="secondary" onClick={addRestTime}>
                +30s
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {workoutPlan.exercises.map((workoutEx, index) => {
          const exData = exerciseData[workoutEx.exerciseId];
          const exercise = workoutEx.exercise;
          const previous = getPreviousPerformance(workoutEx.exerciseId);
          const completedSetsCount = exData.sets.filter(s => s.completed).length;
          const bodyweight = isBodyweight(workoutEx.exerciseId);

          return (
            <Card key={workoutEx.exerciseId} className="overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExercise(workoutEx.exerciseId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <h3 className="text-lg font-semibold">{exercise.name}</h3>
                      {completedSetsCount > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {completedSetsCount}/{exData.sets.length} sets
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {exercise.muscleGroups.join(', ')}
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      Target: {workoutEx.sets} sets × {workoutEx.reps || workoutEx.duration + 's'} {workoutEx.reps ? 'reps' : ''}
                    </p>
                  </div>
                  {exData.expanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {exData.expanded && (
                <div className="border-t bg-gray-50 p-4 space-y-4">
                  {/* Sets */}
                  <div className="space-y-3">
                    {exData.sets.map((set, setIndex) => (
                      <div
                        key={setIndex}
                        className={`bg-white rounded-lg p-3 border-2 ${
                          set.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="font-semibold text-gray-700 w-16">
                            SET {set.setNumber}
                          </div>
                          
                          {!bodyweight && (
                            <div className="flex-1">
                              <Input
                                type="number"
                                placeholder="Weight"
                                value={set.weight || ''}
                                onChange={(e) => updateSet(
                                  workoutEx.exerciseId,
                                  setIndex,
                                  'weight',
                                  parseFloat(e.target.value) || null
                                )}
                                className="text-center"
                                disabled={set.completed}
                              />
                              <div className="text-xs text-center text-gray-500 mt-1">{weightUnit}</div>
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder={workoutEx.duration ? "Duration (s)" : "Reps"}
                              value={workoutEx.duration ? (set.duration || '') : (set.reps || '')}
                              onChange={(e) => updateSet(
                                workoutEx.exerciseId,
                                setIndex,
                                workoutEx.duration ? 'duration' : 'reps',
                                parseFloat(e.target.value) || null
                              )}
                              className="text-center"
                              disabled={set.completed}
                            />
                            <div className="text-xs text-center text-gray-500 mt-1">
                              {workoutEx.duration ? 'seconds' : 'reps'}
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant={set.completed ? "default" : "outline"}
                            onClick={() => completeSet(workoutEx.exerciseId, setIndex)}
                            className={set.completed ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {set.completed ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Done
                              </>
                            ) : (
                              'Complete'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rest Timer Button */}
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Rest Timer</p>
                      <p className="text-xs text-gray-600">{exData.sets[0].restTime} seconds</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startRestTimer(workoutEx.exerciseId, exData.sets[0].restTime)}
                      disabled={activeRestExercise === workoutEx.exerciseId}
                    >
                      <Timer className="h-4 w-4 mr-2" />
                      Start Rest
                    </Button>
                  </div>

                  {/* Previous Performance */}
                  <div className="bg-purple-50 p-3 rounded-lg space-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Previous Performance</span>
                      {onViewExerciseHistory && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewExerciseHistory(workoutEx.exerciseId)}
                          className="h-7 text-xs"
                        >
                          <History className="h-3 w-3 mr-1" />
                          View History
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">💪 Previous:</span>
                      <span className="text-gray-700">{previous.lastWorkout}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">🏆 PR:</span>
                      <span className="text-gray-700">{previous.personalRecord}</span>
                    </div>
                  </div>

                  {/* Exercise Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <Textarea
                      value={exData.notes}
                      onChange={(e) => updateExerciseNotes(workoutEx.exerciseId, e.target.value)}
                      placeholder="Add notes about this exercise..."
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleEndWorkout}
            size="lg"
            className="w-full"
            disabled={progress.completedSets === 0}
          >
            End Workout
          </Button>
        </div>
      </div>
    </div>
  );
}