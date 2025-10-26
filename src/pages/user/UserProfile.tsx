import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Bell, Dumbbell, Save } from 'lucide-react';

export default function UserProfile() {
  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">John Doe</h3>
              <p className="text-gray-600 text-sm">john.doe@example.com</p>
              <Button variant="outline" size="sm" className="mt-2">
                Change Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">First Name</label>
              <Input defaultValue="John" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Last Name</label>
              <Input defaultValue="Doe" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input type="email" defaultValue="john.doe@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <Input type="tel" placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date of Birth</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Gender</label>
              <Select defaultValue="male">
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fitness Profile */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Fitness Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Current Weight (lbs)</label>
              <Input type="number" defaultValue="165" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Height (inches)</label>
              <Input type="number" defaultValue="70" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Fitness Level</label>
              <Select defaultValue="intermediate">
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Primary Goal</label>
              <Select defaultValue="weight-loss">
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-building">Muscle Building</SelectItem>
                  <SelectItem value="strength-training">Strength Training</SelectItem>
                  <SelectItem value="general-fitness">General Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Available */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Equipment Available</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Dumbbells',
              'Barbell',
              'Resistance Bands',
              'Pull-up Bar',
              'Bench',
              'Kettlebells',
              'Jump Rope',
              'Yoga Mat',
              'Foam Roller',
            ].map((equipment) => (
              <label key={equipment} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{equipment}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Workout Reminders</p>
                <p className="text-sm text-gray-600">Get notified before scheduled workouts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Progress Updates</p>
                <p className="text-sm text-gray-600">Weekly progress summaries</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Workout Assignments</p>
                <p className="text-sm text-gray-600">When your trainer assigns new workouts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-2">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}