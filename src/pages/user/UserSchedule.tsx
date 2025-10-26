import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';

interface ScheduledWorkout {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  completed: boolean;
}

export default function UserSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const scheduledWorkouts: ScheduledWorkout[] = [
    {
      id: '1',
      name: 'Morning Cardio Blast',
      date: '2024-01-15',
      time: '6:00 AM',
      duration: '45 min',
      type: 'Cardio',
      completed: true,
    },
    {
      id: '2',
      name: 'Upper Body Strength',
      date: '2024-01-16',
      time: '5:30 PM',
      duration: '60 min',
      type: 'Strength',
      completed: false,
    },
    {
      id: '3',
      name: 'Leg Day Challenge',
      date: '2024-01-17',
      time: '6:00 PM',
      duration: '50 min',
      type: 'Strength',
      completed: false,
    },
    {
      id: '4',
      name: 'Flexibility & Recovery',
      date: '2024-01-18',
      time: '7:00 AM',
      duration: '30 min',
      type: 'Recovery',
      completed: false,
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getWorkoutsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return scheduledWorkouts.filter(w => w.date === dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card>
        <CardContent className="pt-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const workouts = getWorkoutsForDate(day);
              const isToday = 
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 ${
                    isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  } ${workouts.length > 0 ? 'bg-green-50' : ''}`}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {workouts.length > 0 && (
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Workouts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
        <div className="space-y-3">
          {scheduledWorkouts.filter(w => !w.completed).map((workout) => (
            <Card key={workout.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Dumbbell className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{workout.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(workout.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at {workout.time} • {workout.duration}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{workout.type}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {scheduledWorkouts.filter(w => !w.completed).length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming workouts</h3>
                <p className="text-gray-600">Your schedule is clear for now.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}