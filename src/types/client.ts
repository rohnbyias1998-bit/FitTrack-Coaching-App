export interface Client {
  id: string;
  name: string;
  email: string;
  profilePhoto: string; // URL to photo
  goal: 'weight-loss' | 'muscle-building' | 'strength' | 'calisthenics-mastery' | 'general-fitness';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'inactive' | 'needs-attention';
  dateJoined: string; // ISO date string
  lastWorkoutDate: string | null; // ISO date string or null
  lastCheckInDate: string | null;
  complianceRate: number; // 0-100 percentage
  totalWorkoutsAssigned: number;
  totalWorkoutsCompleted: number;
  currentProgram: string | null; // e.g., "12 Week Muscle Builder"
  equipment: string[]; // e.g., ["full-gym", "pull-up-bar"]
  nutritionTracking: boolean;
  notes: string; // Coach notes about this client
}

export const mockClients: Client[] = [
  {
    id: "client-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=1",
    goal: "weight-loss",
    experienceLevel: "beginner",
    status: "active",
    dateJoined: "2024-01-15T00:00:00Z",
    lastWorkoutDate: "2024-03-18T10:30:00Z",
    lastCheckInDate: "2024-03-17T08:00:00Z",
    complianceRate: 87,
    totalWorkoutsAssigned: 45,
    totalWorkoutsCompleted: 39,
    currentProgram: "8 Week Fat Loss Starter",
    equipment: ["dumbbells", "resistance-bands"],
    nutritionTracking: true,
    notes: "Very motivated. Prefers morning workouts. Has knee sensitivity - avoid high-impact exercises."
  },
  {
    id: "client-2",
    name: "Marcus Thompson",
    email: "marcus.t@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    goal: "muscle-building",
    experienceLevel: "intermediate",
    status: "active",
    dateJoined: "2023-11-20T00:00:00Z",
    lastWorkoutDate: "2024-03-19T18:00:00Z",
    lastCheckInDate: "2024-03-19T07:30:00Z",
    complianceRate: 92,
    totalWorkoutsAssigned: 68,
    totalWorkoutsCompleted: 63,
    currentProgram: "12 Week Muscle Builder",
    equipment: ["full-gym"],
    nutritionTracking: true,
    notes: "Excellent form. Looking to compete in physique competition next year. Responds well to progressive overload."
  },
  {
    id: "client-3",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    goal: "calisthenics-mastery",
    experienceLevel: "advanced",
    status: "active",
    dateJoined: "2023-08-10T00:00:00Z",
    lastWorkoutDate: "2024-03-19T06:00:00Z",
    lastCheckInDate: "2024-03-18T20:00:00Z",
    complianceRate: 95,
    totalWorkoutsAssigned: 120,
    totalWorkoutsCompleted: 114,
    currentProgram: "Advanced Calisthenics Skills",
    equipment: ["pull-up-bar", "parallettes", "rings"],
    nutritionTracking: false,
    notes: "Working on planche and front lever progressions. Very disciplined. Prefers skill-focused training."
  },
  {
    id: "client-4",
    name: "David Rodriguez",
    email: "d.rodriguez@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=8",
    goal: "strength",
    experienceLevel: "intermediate",
    status: "needs-attention",
    dateJoined: "2024-02-01T00:00:00Z",
    lastWorkoutDate: "2024-03-10T17:00:00Z",
    lastCheckInDate: "2024-03-05T09:00:00Z",
    complianceRate: 58,
    totalWorkoutsAssigned: 32,
    totalWorkoutsCompleted: 19,
    currentProgram: "Powerlifting Foundation",
    equipment: ["full-gym", "barbell", "squat-rack"],
    nutritionTracking: true,
    notes: "Missed last 2 weeks. Work schedule conflict. Need to check in and adjust program."
  },
  {
    id: "client-5",
    name: "Jessica Martinez",
    email: "jess.martinez@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=9",
    goal: "general-fitness",
    experienceLevel: "beginner",
    status: "active",
    dateJoined: "2024-02-20T00:00:00Z",
    lastWorkoutDate: "2024-03-18T16:30:00Z",
    lastCheckInDate: "2024-03-16T10:00:00Z",
    complianceRate: 78,
    totalWorkoutsAssigned: 24,
    totalWorkoutsCompleted: 19,
    currentProgram: "Beginner Full Body",
    equipment: ["dumbbells", "yoga-mat"],
    nutritionTracking: false,
    notes: "New to fitness. Building consistency. Enjoys variety in workouts. Prefers 30-45 min sessions."
  },
  {
    id: "client-6",
    name: "Alex Kim",
    email: "alex.kim@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=14",
    goal: "muscle-building",
    experienceLevel: "advanced",
    status: "inactive",
    dateJoined: "2023-06-15T00:00:00Z",
    lastWorkoutDate: "2024-02-28T19:00:00Z",
    lastCheckInDate: "2024-02-25T11:00:00Z",
    complianceRate: 35,
    totalWorkoutsAssigned: 95,
    totalWorkoutsCompleted: 33,
    currentProgram: null,
    equipment: ["full-gym"],
    nutritionTracking: false,
    notes: "On extended break due to travel. Plans to resume in April. Previously very consistent."
  },
  {
    id: "client-7",
    name: "Rachel Green",
    email: "rachel.green@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=10",
    goal: "weight-loss",
    experienceLevel: "intermediate",
    status: "active",
    dateJoined: "2023-12-01T00:00:00Z",
    lastWorkoutDate: "2024-03-19T07:00:00Z",
    lastCheckInDate: "2024-03-19T06:45:00Z",
    complianceRate: 89,
    totalWorkoutsAssigned: 56,
    totalWorkoutsCompleted: 50,
    currentProgram: "12 Week Transformation",
    equipment: ["full-gym", "cardio-machines"],
    nutritionTracking: true,
    notes: "Down 18 lbs so far. Great progress. Loves HIIT workouts. Very responsive to feedback."
  },
  {
    id: "client-8",
    name: "Tom Wilson",
    email: "tom.wilson@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=13",
    goal: "strength",
    experienceLevel: "beginner",
    status: "needs-attention",
    dateJoined: "2024-03-01T00:00:00Z",
    lastWorkoutDate: "2024-03-12T18:30:00Z",
    lastCheckInDate: null,
    complianceRate: 45,
    totalWorkoutsAssigned: 15,
    totalWorkoutsCompleted: 7,
    currentProgram: "Starting Strength",
    equipment: ["barbell", "squat-rack", "bench"],
    nutritionTracking: false,
    notes: "Struggling with consistency. Never checked in. Need to establish better communication."
  },
  {
    id: "client-9",
    name: "Nina Patel",
    email: "nina.patel@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=16",
    goal: "calisthenics-mastery",
    experienceLevel: "intermediate",
    status: "active",
    dateJoined: "2024-01-05T00:00:00Z",
    lastWorkoutDate: "2024-03-19T12:00:00Z",
    lastCheckInDate: "2024-03-18T15:30:00Z",
    complianceRate: 84,
    totalWorkoutsAssigned: 52,
    totalWorkoutsCompleted: 44,
    currentProgram: "Bodyweight Strength Builder",
    equipment: ["pull-up-bar", "dip-bars", "yoga-mat"],
    nutritionTracking: true,
    notes: "Working on first pull-up. Making steady progress. Very engaged and asks great questions."
  },
  {
    id: "client-10",
    name: "Chris Anderson",
    email: "chris.anderson@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=15",
    goal: "general-fitness",
    experienceLevel: "intermediate",
    status: "active",
    dateJoined: "2023-10-10T00:00:00Z",
    lastWorkoutDate: "2024-03-18T14:00:00Z",
    lastCheckInDate: "2024-03-17T19:00:00Z",
    complianceRate: 91,
    totalWorkoutsAssigned: 78,
    totalWorkoutsCompleted: 71,
    currentProgram: "Functional Fitness",
    equipment: ["dumbbells", "kettlebells", "resistance-bands"],
    nutritionTracking: true,
    notes: "Very consistent. Enjoys functional movements. Training for obstacle course race in June."
  }
];
