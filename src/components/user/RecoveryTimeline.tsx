import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, X } from 'lucide-react';

interface RecoveryTimelineProps {
  musclesWorked: string[];
  onClose: () => void;
}

const BASE_RECOVERY_TIMES: Record<string, number> = {
  chest: 72,
  back: 72,
  legs: 72,
  shoulders: 48,
  biceps: 48,
  triceps: 48,
  abs: 24,
  core: 24,
};

export default function RecoveryTimeline({ musclesWorked, onClose }: RecoveryTimelineProps) {
  const getRecoveryDate = (muscle: string): string => {
    const normalized = muscle.toLowerCase();
    const hours = BASE_RECOVERY_TIMES[normalized] || 48;
    const recoveryDate = new Date(Date.now() + hours * 60 * 60 * 1000);
    
    return recoveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Recovery Timeline</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-green-800 mb-4">
          Great workout! Here's when these muscles will be recovered:
        </p>

        <div className="space-y-2">
          {musclesWorked.map((muscle) => (
            <div key={muscle} className="flex items-center justify-between bg-white rounded p-2">
              <span className="font-medium text-sm">{muscle}</span>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{getRecoveryDate(muscle)}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-green-700 mt-4">
          💡 Tip: Check the Recovery tab to see your full muscle recovery status
        </p>
      </CardContent>
    </Card>
  );
}
