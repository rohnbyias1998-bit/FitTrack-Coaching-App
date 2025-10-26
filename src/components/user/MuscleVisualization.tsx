import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutSession } from '@/types/exercise';
import { RotateCcw, Info } from 'lucide-react';

interface MuscleVisualizationProps {
  workoutHistory: WorkoutSession[];
  selectedSession?: WorkoutSession | null;
  showRecovery?: boolean;
}

interface MuscleActivation {
  muscleGroup: string;
  activation: number; // 0-100
  recovery?: number; // 0-100
  lastWorked?: string;
}

const MUSCLE_COLORS = {
  high: '#ef4444', // Red (70-100%)
  medium: '#f97316', // Orange (40-69%)
  low: '#fbbf24', // Yellow (1-39%)
  none: '#e5e7eb', // Gray (0%)
  recovered: '#22c55e', // Green (recovered)
  partial: '#eab308', // Yellow (partial recovery)
  recovering: '#ef4444', // Red (still recovering)
};

export default function MuscleVisualization({
  workoutHistory,
  selectedSession,
  showRecovery = false,
}: MuscleVisualizationProps) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  // Calculate muscle activation from workout session(s)
  const calculateMuscleActivation = (): Record<string, MuscleActivation> => {
    const activations: Record<string, MuscleActivation> = {};
    const sessions = selectedSession ? [selectedSession] : workoutHistory.slice(0, 1);

    sessions.forEach(session => {
      if (session.status === 'completed') {
        session.exercises.forEach(exercise => {
          if (!exercise.skipped && exercise.completedSets.length > 0) {
            exercise.exercise.muscleGroups.forEach(muscle => {
              const normalized = muscle.toLowerCase();
              const sets = exercise.completedSets.length;
              
              // Calculate activation based on sets (simplified)
              let activation = Math.min(100, sets * 20);
              
              if (!activations[normalized]) {
                activations[normalized] = {
                  muscleGroup: normalized,
                  activation,
                  lastWorked: session.completedAt || session.startedAt,
                };
              } else {
                activations[normalized].activation = Math.min(
                  100,
                  activations[normalized].activation + activation
                );
              }
            });
          }
        });
      }
    });

    // Add recovery data if needed
    if (showRecovery) {
      Object.keys(activations).forEach(muscle => {
        const lastWorkout = activations[muscle].lastWorked;
        if (lastWorkout) {
          const hoursSince = (Date.now() - new Date(lastWorkout).getTime()) / (1000 * 60 * 60);
          const baseRecovery = 48; // hours
          activations[muscle].recovery = Math.min(100, Math.round((hoursSince / baseRecovery) * 100));
        }
      });
    }

    return activations;
  };

  const muscleActivations = calculateMuscleActivation();

  const getMuscleColor = (muscle: string): string => {
    const activation = muscleActivations[muscle];
    if (!activation) return MUSCLE_COLORS.none;

    if (showRecovery && activation.recovery !== undefined) {
      if (activation.recovery >= 80) return MUSCLE_COLORS.recovered;
      if (activation.recovery >= 50) return MUSCLE_COLORS.partial;
      return MUSCLE_COLORS.recovering;
    }

    if (activation.activation >= 70) return MUSCLE_COLORS.high;
    if (activation.activation >= 40) return MUSCLE_COLORS.medium;
    if (activation.activation > 0) return MUSCLE_COLORS.low;
    return MUSCLE_COLORS.none;
  };

  const getMuscleOpacity = (muscle: string): number => {
    const activation = muscleActivations[muscle];
    if (!activation) return 0.3;
    return 0.3 + (activation.activation / 100) * 0.7;
  };

  const handleMuscleClick = (muscle: string) => {
    setSelectedMuscle(muscle === selectedMuscle ? null : muscle);
  };

  const getMuscleInfo = (muscle: string) => {
    const activation = muscleActivations[muscle];
    if (!activation) return null;

    return {
      name: muscle.charAt(0).toUpperCase() + muscle.slice(1),
      activation: activation.activation,
      recovery: activation.recovery,
      lastWorked: activation.lastWorked,
    };
  };

  // Calculate total volume
  const getTotalVolume = () => {
    let volume = 0;
    const sessions = selectedSession ? [selectedSession] : workoutHistory.slice(0, 1);
    
    sessions.forEach(session => {
      session.exercises.forEach(ex => {
        ex.completedSets.forEach(set => {
          if (set.weight && set.reps) {
            volume += set.weight * set.reps;
          }
        });
      });
    });
    
    return volume;
  };

  const getPrimaryMuscles = () => {
    return Object.entries(muscleActivations)
      .filter(([_, data]) => data.activation >= 70)
      .map(([muscle]) => muscle.charAt(0).toUpperCase() + muscle.slice(1));
  };

  const getSecondaryMuscles = () => {
    return Object.entries(muscleActivations)
      .filter(([_, data]) => data.activation >= 40 && data.activation < 70)
      .map(([muscle]) => muscle.charAt(0).toUpperCase() + muscle.slice(1));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              💪 {showRecovery ? 'Muscle Recovery Status' : 'Muscles Worked Today'}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={view === 'front' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('front')}
              >
                Front View
              </Button>
              <Button
                variant={view === 'back' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('back')}
              >
                Back View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Body Diagram */}
            <div className="lg:col-span-2">
              <div className="relative bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[500px]">
                {view === 'front' ? (
                  <FrontBodyDiagram
                    muscleActivations={muscleActivations}
                    getMuscleColor={getMuscleColor}
                    getMuscleOpacity={getMuscleOpacity}
                    onMuscleClick={handleMuscleClick}
                    selectedMuscle={selectedMuscle}
                  />
                ) : (
                  <BackBodyDiagram
                    muscleActivations={muscleActivations}
                    getMuscleColor={getMuscleColor}
                    getMuscleOpacity={getMuscleOpacity}
                    onMuscleClick={handleMuscleClick}
                    selectedMuscle={selectedMuscle}
                  />
                )}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 justify-center">
                {showRecovery ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: MUSCLE_COLORS.recovered }} />
                      <span className="text-sm">Recovered (80-100%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: MUSCLE_COLORS.partial }} />
                      <span className="text-sm">Partial (50-79%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: MUSCLE_COLORS.recovering }} />
                      <span className="text-sm">Recovering (0-49%)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: MUSCLE_COLORS.high }} />
                      <span className="text-sm">High (70-100%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: MUSCLE_COLORS.medium }} />
                      <span className="text-sm">Medium (40-69%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: MUSCLE_COLORS.low }} />
                      <span className="text-sm">Low (1-39%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: MUSCLE_COLORS.none }} />
                      <span className="text-sm">Not Worked</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-4">
              {selectedMuscle ? (
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {getMuscleInfo(selectedMuscle)?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Activation</p>
                      <p className="text-2xl font-bold">
                        {getMuscleInfo(selectedMuscle)?.activation}%
                      </p>
                    </div>
                    {showRecovery && getMuscleInfo(selectedMuscle)?.recovery !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600">Recovery</p>
                        <p className="text-2xl font-bold">
                          {getMuscleInfo(selectedMuscle)?.recovery}%
                        </p>
                      </div>
                    )}
                    {getMuscleInfo(selectedMuscle)?.lastWorked && (
                      <div>
                        <p className="text-sm text-gray-600">Last Worked</p>
                        <p className="text-sm">
                          {new Date(getMuscleInfo(selectedMuscle)!.lastWorked!).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-500">
                    <Info className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Click on a muscle to see details</p>
                  </CardContent>
                </Card>
              )}

              {!showRecovery && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Primary Muscles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {getPrimaryMuscles().length > 0 ? (
                          getPrimaryMuscles().map(muscle => (
                            <Badge key={muscle} className="bg-red-100 text-red-800">
                              {muscle}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">None</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Secondary Muscles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {getSecondaryMuscles().length > 0 ? (
                          getSecondaryMuscles().map(muscle => (
                            <Badge key={muscle} variant="outline">
                              {muscle}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">None</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Total Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{getTotalVolume().toLocaleString()} lbs</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Front Body Diagram Component
function FrontBodyDiagram({ muscleActivations, getMuscleColor, getMuscleOpacity, onMuscleClick, selectedMuscle }: any) {
  return (
    <svg viewBox="0 0 200 400" className="w-full max-w-md">
      {/* Head */}
      <ellipse cx="100" cy="30" rx="20" ry="25" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
      
      {/* Neck */}
      <rect x="90" y="50" width="20" height="15" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
      
      {/* Shoulders */}
      <g
        onClick={() => onMuscleClick('shoulders')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'shoulders' ? 1 : getMuscleOpacity('shoulders') }}
      >
        <ellipse cx="70" cy="75" rx="18" ry="12" fill={getMuscleColor('shoulders')} stroke="#374151" strokeWidth="1" />
        <ellipse cx="130" cy="75" rx="18" ry="12" fill={getMuscleColor('shoulders')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Chest */}
      <g
        onClick={() => onMuscleClick('chest')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'chest' ? 1 : getMuscleOpacity('chest') }}
      >
        <path
          d="M 75 85 Q 100 95 125 85 L 120 120 Q 100 125 80 120 Z"
          fill={getMuscleColor('chest')}
          stroke="#374151"
          strokeWidth="1"
        />
      </g>
      
      {/* Abs */}
      <g
        onClick={() => onMuscleClick('abs')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'abs' ? 1 : getMuscleOpacity('abs') }}
      >
        <rect x="85" y="125" width="30" height="50" rx="5" fill={getMuscleColor('abs')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Biceps */}
      <g
        onClick={() => onMuscleClick('biceps')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'biceps' ? 1 : getMuscleOpacity('biceps') }}
      >
        <ellipse cx="55" cy="110" rx="10" ry="25" fill={getMuscleColor('biceps')} stroke="#374151" strokeWidth="1" />
        <ellipse cx="145" cy="110" rx="10" ry="25" fill={getMuscleColor('biceps')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Forearms */}
      <g
        onClick={() => onMuscleClick('forearms')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'forearms' ? 1 : getMuscleOpacity('forearms') }}
      >
        <rect x="48" y="135" width="12" height="40" rx="3" fill={getMuscleColor('forearms')} stroke="#374151" strokeWidth="1" />
        <rect x="140" y="135" width="12" height="40" rx="3" fill={getMuscleColor('forearms')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Quads */}
      <g
        onClick={() => onMuscleClick('quads')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'quads' ? 1 : getMuscleOpacity('quads') }}
      >
        <rect x="75" y="180" width="18" height="80" rx="5" fill={getMuscleColor('quads')} stroke="#374151" strokeWidth="1" />
        <rect x="107" y="180" width="18" height="80" rx="5" fill={getMuscleColor('quads')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Calves */}
      <g
        onClick={() => onMuscleClick('calves')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'calves' ? 1 : getMuscleOpacity('calves') }}
      >
        <ellipse cx="84" cy="290" rx="8" ry="30" fill={getMuscleColor('calves')} stroke="#374151" strokeWidth="1" />
        <ellipse cx="116" cy="290" rx="8" ry="30" fill={getMuscleColor('calves')} stroke="#374151" strokeWidth="1" />
      </g>
    </svg>
  );
}

// Back Body Diagram Component
function BackBodyDiagram({ muscleActivations, getMuscleColor, getMuscleOpacity, onMuscleClick, selectedMuscle }: any) {
  return (
    <svg viewBox="0 0 200 400" className="w-full max-w-md">
      {/* Head */}
      <ellipse cx="100" cy="30" rx="20" ry="25" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
      
      {/* Neck */}
      <rect x="90" y="50" width="20" height="15" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
      
      {/* Shoulders (back) */}
      <g
        onClick={() => onMuscleClick('shoulders')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'shoulders' ? 1 : getMuscleOpacity('shoulders') }}
      >
        <ellipse cx="70" cy="75" rx="18" ry="12" fill={getMuscleColor('shoulders')} stroke="#374151" strokeWidth="1" />
        <ellipse cx="130" cy="75" rx="18" ry="12" fill={getMuscleColor('shoulders')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Back */}
      <g
        onClick={() => onMuscleClick('back')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'back' ? 1 : getMuscleOpacity('back') }}
      >
        <path
          d="M 75 85 L 125 85 L 120 140 L 80 140 Z"
          fill={getMuscleColor('back')}
          stroke="#374151"
          strokeWidth="1"
        />
      </g>
      
      {/* Lower Back */}
      <g
        onClick={() => onMuscleClick('lower back')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'lower back' ? 1 : getMuscleOpacity('lower back') }}
      >
        <rect x="85" y="145" width="30" height="30" rx="5" fill={getMuscleColor('lower back')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Triceps */}
      <g
        onClick={() => onMuscleClick('triceps')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'triceps' ? 1 : getMuscleOpacity('triceps') }}
      >
        <ellipse cx="55" cy="110" rx="10" ry="25" fill={getMuscleColor('triceps')} stroke="#374151" strokeWidth="1" />
        <ellipse cx="145" cy="110" rx="10" ry="25" fill={getMuscleColor('triceps')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Forearms */}
      <g
        onClick={() => onMuscleClick('forearms')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'forearms' ? 1 : getMuscleOpacity('forearms') }}
      >
        <rect x="48" y="135" width="12" height="40" rx="3" fill={getMuscleColor('forearms')} stroke="#374151" strokeWidth="1" />
        <rect x="140" y="135" width="12" height="40" rx="3" fill={getMuscleColor('forearms')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Glutes */}
      <g
        onClick={() => onMuscleClick('glutes')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'glutes' ? 1 : getMuscleOpacity('glutes') }}
      >
        <ellipse cx="90" cy="180" rx="15" ry="18" fill={getMuscleColor('glutes')} stroke="#374151" strokeWidth="1" />
        <ellipse cx="110" cy="180" rx="15" ry="18" fill={getMuscleColor('glutes')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Hamstrings */}
      <g
        onClick={() => onMuscleClick('hamstrings')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'hamstrings' ? 1 : getMuscleOpacity('hamstrings') }}
      >
        <rect x="75" y="200" width="18" height="60" rx="5" fill={getMuscleColor('hamstrings')} stroke="#374151" strokeWidth="1" />
        <rect x="107" y="200" width="18" height="60" rx="5" fill={getMuscleColor('hamstrings')} stroke="#374151" strokeWidth="1" />
      </g>
      
      {/* Calves */}
      <g
        onClick={() => onMuscleClick('calves')}
        className="cursor-pointer transition-all hover:opacity-80"
        style={{ opacity: selectedMuscle === 'calves' ? 1 : getMuscleOpacity('calves') }}
      >
        <ellipse cx="84" cy="290" rx="8" ry="30" fill={getMuscleColor('calves')} stroke="#374151" strokeWidth="1" />
        <ellipse cx="116" cy="290" rx="8" ry="30" fill={getMuscleColor('calves')} stroke="#374151" strokeWidth="1" />
      </g>
    </svg>
  );
}
