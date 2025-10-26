import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Tag,
  MessageCircle,
} from "lucide-react";
import { Feedback } from "@/types/feedback";

interface FeedbackManagementProps {
  feedbackList: Feedback[];
  onUpdateFeedback: (feedbackId: string, updates: Partial<Feedback>) => void;
  onDeleteFeedback?: (feedbackId: string) => void;
}

const FeedbackManagement: React.FC<FeedbackManagementProps> = ({
  feedbackList,
  onUpdateFeedback,
  onDeleteFeedback,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const filteredFeedback = feedbackList.filter((feedback) => {
    const matchesSearch = 
      feedback.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
    const matchesType = typeFilter === "all" || feedback.category === typeFilter;
    const matchesPriority = priorityFilter === "all" || feedback.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "bug":
        return <Bug className="h-4 w-4" />;
      case "feature":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "bug":
        return "bg-red-100 text-red-800";
      case "feature":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (feedbackId: string, newStatus: string) => {
    const updates: Partial<Feedback> = {
      status: newStatus as Feedback["status"],
      updatedAt: new Date().toISOString(),
    };

    if (newStatus === "resolved") {
      updates.resolvedAt = new Date().toISOString();
      updates.resolvedBy = "Admin"; // In real app, get from auth context
    }

    onUpdateFeedback(feedbackId, updates);
  };

  const handleAddAdminNotes = (feedbackId: string) => {
    if (adminNotes.trim()) {
      onUpdateFeedback(feedbackId, {
        adminNotes: adminNotes.trim(),
        updatedAt: new Date().toISOString(),
      });
      setAdminNotes("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: feedbackList.length,
    open: feedbackList.filter(f => f.status === "open").length,
    inProgress: feedbackList.filter(f => f.status === "in_progress").length,
    resolved: feedbackList.filter(f => f.status === "resolved").length,
    bugs: feedbackList.filter(f => f.category === "bug").length,
    features: feedbackList.filter(f => f.category === "feature").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Feedback Management</h2>
        <p className="text-muted-foreground">
          Manage user feedback, bug reports, and feature requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
              <p className="text-xs text-muted-foreground">Open</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.bugs}</p>
              <p className="text-xs text-muted-foreground">Bugs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.features}</p>
              <p className="text-xs text-muted-foreground">Features</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback List</CardTitle>
          <CardDescription>
            {filteredFeedback.length} feedback item{filteredFeedback.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFeedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No feedback found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No feedback has been submitted yet"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{feedback.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {feedback.description}
                        </p>
                        {feedback.category && (
                          <Badge variant="outline" className="mt-1">
                            <Tag className="h-3 w-3 mr-1" />
                            {feedback.category}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{feedback.userName}</p>
                          <p className="text-xs text-muted-foreground">{feedback.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(feedback.category)}>
                        {getTypeIcon(feedback.category)}
                        <span className="ml-1 capitalize">
                          {feedback.category || "general"}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(feedback.priority)}>
                        {feedback.priority?.charAt(0).toUpperCase() + feedback.priority?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={feedback.status}
                        onValueChange={(value) => handleStatusUpdate(feedback.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(feedback.status)}
                              <span className="capitalize">{feedback.status?.replace("_", " ")}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(feedback.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Feedback Detail Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        {selectedFeedback && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTypeIcon(selectedFeedback.category)}
                {selectedFeedback.title}
              </DialogTitle>
              <DialogDescription>
                Submitted by {selectedFeedback.userName} on {formatDate(selectedFeedback.createdAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Badges */}
              <div className="flex gap-2">
                <Badge className={getTypeColor(selectedFeedback.category)}>
                  {getTypeIcon(selectedFeedback.category)}
                  <span className="ml-1 capitalize">
                    {selectedFeedback.category || "general"}
                  </span>
                </Badge>
                <Badge className={getPriorityColor(selectedFeedback.priority)}>
                  {selectedFeedback.priority?.charAt(0).toUpperCase() + selectedFeedback.priority?.slice(1)}
                </Badge>
                <Badge className={getStatusColor(selectedFeedback.status)}>
                  {getStatusIcon(selectedFeedback.status)}
                  <span className="ml-1 capitalize">
                    {selectedFeedback.status?.replace("_", " ")}
                  </span>
                </Badge>
                {selectedFeedback.category && (
                  <Badge variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {selectedFeedback.category}
                  </Badge>
                )}
              </div>

              {/* ... keep rest of dialog content ... */}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default FeedbackManagement;