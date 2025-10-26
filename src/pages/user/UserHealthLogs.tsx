import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Heart, Weight, Activity } from 'lucide-react';

interface HealthLogData {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  heartRate?: number;
  bloodPressure?: string;
  notes?: string;
}

export default function UserHealthLogs() {
  const [showAddForm, setShowAddForm] = useState(false);

  const healthLogs: HealthLogData[] = [
    {
      id: '1',
      date: '2024-01-15',
      weight: 165,
      bodyFat: 18.5,
      heartRate: 72,
      bloodPressure: '120/80',
      notes: 'Feeling energetic after morning workout',
    },
    {
      id: '2',
      date: '2024-01-14',
      weight: 165.5,
      heartRate: 75,
      notes: 'Good recovery day',
    },
    {
      id: '3',
      date: '2024-01-13',
      weight: 166,
      bodyFat: 18.8,
      heartRate: 78,
      bloodPressure: '118/78',
    },
    {
      id: '4',
      date: '2024-01-12',
      weight: 166.2,
      heartRate: 74,
      notes: 'Completed intense leg workout',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">Track your health metrics over time</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">New Health Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Weight (lbs)</label>
                <Input type="number" placeholder="165" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Body Fat %</label>
                <Input type="number" placeholder="18.5" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Heart Rate (bpm)</label>
                <Input type="number" placeholder="72" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Blood Pressure</label>
                <Input placeholder="120/80" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Notes</label>
                <Textarea placeholder="How are you feeling today?" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button>Save Entry</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Logs List */}
      <div className="space-y-4">
        {healthLogs.map((log) => (
          <Card key={log.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">
                  {new Date(log.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Weight className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-semibold">{log.weight} lbs</p>
                  </div>
                </div>
                {log.bodyFat && (
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Body Fat</p>
                      <p className="font-semibold">{log.bodyFat}%</p>
                    </div>
                  </div>
                )}
                {log.heartRate && (
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Heart Rate</p>
                      <p className="font-semibold">{log.heartRate} bpm</p>
                    </div>
                  </div>
                )}
                {log.bloodPressure && (
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Blood Pressure</p>
                      <p className="font-semibold">{log.bloodPressure}</p>
                    </div>
                  </div>
                )}
              </div>

              {log.notes && (
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 font-medium mb-1">Notes:</p>
                  <p className="text-sm">{log.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}