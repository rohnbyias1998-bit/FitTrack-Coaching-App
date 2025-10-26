import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Send,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Feedback } from "@/types/feedback";

interface FeedbackButtonProps {
  userId: number;
  userName: string;
  userEmail: string;
  onFeedbackSubmit: (feedback: Omit<Feedback, "id" | "createdAt" | "updatedAt">) => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  userId,
  userName,
  userEmail,
  onFeedbackSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"bug_report" | "feature_request" | "general_feedback">("general_feedback");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setType("general_feedback");
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: Omit<Feedback, "id" | "createdAt" | "updatedAt"> = {
        userId,
        userName,
        userEmail,
        type,
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "open",
        category: category.trim() || undefined,
      };

      onFeedbackSubmit(feedbackData);

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it shortly.",
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (feedbackType: string) => {
    switch (feedbackType) {
      case "bug_report":
        return <Bug className="h-4 w-4" />;
      case "feature_request":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (feedbackType: string) => {
    switch (feedbackType) {
      case "bug_report":
        return "bg-red-100 text-red-800";
      case "feature_request":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve FitTrack by reporting bugs or suggesting new features.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Feedback Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Feedback Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general_feedback">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    General Feedback
                  </div>
                </SelectItem>
                <SelectItem value="bug_report">
                  <div className="flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Bug Report
                  </div>
                </SelectItem>
                <SelectItem value="feature_request">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Feature Request
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Workout Tracking, Dashboard, Mobile App"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your feedback"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === "bug_report"
                  ? "Please describe the bug, steps to reproduce, and expected behavior..."
                  : type === "feature_request"
                  ? "Please describe the feature you'd like to see and how it would help..."
                  : "Please provide your feedback in detail..."
              }
              rows={4}
              required
            />
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-3 bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTypeColor(type)}>
                {getTypeIcon(type)}
                <span className="ml-1 capitalize">{type.replace("_", " ")}</span>
              </Badge>
              <Badge className={getPriorityColor(priority)}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Badge>
              {category && (
                <Badge variant="outline">{category}</Badge>
              )}
            </div>
            <h4 className="font-medium text-sm">
              {title || "Feedback Title"}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              From: {userName} ({userEmail})
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !description.trim()}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackButton;