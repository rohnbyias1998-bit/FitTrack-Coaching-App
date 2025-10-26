export interface Feedback {
  id: string;
  userId: number;
  userName: string;
  userEmail: string;
  type: "bug_report" | "feature_request" | "general_feedback";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  category?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  adminNotes?: string;
}

export interface Notification {
  id: string;
  userId: number;
  type: "feedback_received" | "feedback_updated" | "workout_assigned" | "workout_completed" | "system_update";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  feedbackUpdates: boolean;
  workoutAssignments: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
}