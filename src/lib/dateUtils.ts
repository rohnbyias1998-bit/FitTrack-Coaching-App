import { formatDistanceToNow, format, isToday, isYesterday, differenceInDays } from 'date-fns';

export const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  
  try {
    const date = new Date(dateString);
    
    // Use a fixed reference point to avoid hydration mismatches
    // This ensures server and client render the same output
    const daysDiff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      return 'Today';
    } else if (daysDiff === 1) {
      return 'Yesterday';
    } else if (daysDiff < 7) {
      return `${daysDiff} days ago`;
    } else if (daysDiff < 30) {
      const weeks = Math.floor(daysDiff / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  } catch {
    return 'Unknown';
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return 'Unknown';
  }
};