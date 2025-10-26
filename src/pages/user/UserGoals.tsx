import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Trophy, Target } from 'lucide-react';

interface GoalData {
  id: string;
  name: string;
  progress: number;
  target: string;
  deadline: string;
  category: 'weight' | 'strength' | 'endurance' | 'flexibility';
}

export default function UserGoals() {
  const goals: GoalData[] = [
    {
      id: '1',
      name: 'Weight Loss Goal',
      progress: 75,
      target: '10 lbs',
      deadline: 'In 2 weeks',
      category: 'weight',
    },
    {
      id: '2',
      name: '5K Run Time',
      progress: 60,
      target: 'Under 25 minutes',
      deadline: 'In 4 weeks',
      category: 'endurance',
    },
    {
      id: '3',
      name: 'Strength Training',
      progress: 40,
      target: 'Bench 200 lbs',
      deadline: 'In 8 weeks',
      category: 'strength',
    },
    {
      id: '4',
      name: 'Flexibility Goal',
      progress: 30,
      target: 'Touch toes comfortably',
      deadline: 'In 6 weeks',
      category: 'flexibility',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weight':
        return 'bg-blue-100 text-blue-800';
      case 'strength':
        return 'bg-red-100 text-red-800';
      case 'endurance':
        return 'bg-green-100 text-green-800';
      case 'flexibility':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">Set and track your fitness goals</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Goal
        </Button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{goal.name}</h3>
                    <p className="text-sm text-gray-600">
                      Target: {goal.target} • {goal.deadline}
                    </p>
                  </div>
                </div>
                <Badge className={getCategoryColor(goal.category)}>
                  {goal.category}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">{goal.progress}% complete</span>
                </div>
                <Progress value={goal.progress} className="h-3" />
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  Update Progress
                </Button>
                <Button size="sm" variant="ghost">
                  Edit Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
            <p className="text-gray-600 mb-4">
              Start your fitness journey by setting your first goal!
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}