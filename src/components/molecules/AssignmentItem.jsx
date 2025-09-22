import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const AssignmentItem = ({ assignment, course, onToggleComplete, onEdit, className }) => {
  const isOverdue = new Date(assignment.dueDate) < new Date() && !assignment.completed;
  const isDueSoon = new Date(assignment.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && !assignment.completed;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "danger";
      case "Medium": return "warning";
      default: return "secondary";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Exam": return "FileText";
      case "Quiz": return "HelpCircle";
      case "Project": return "Folder";
      case "Homework": return "BookOpen";
      default: return "Circle";
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      assignment.completed ? "bg-slate-50" : "",
      isOverdue ? "border-red-200 bg-red-50" : "",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleComplete(assignment.Id)}
              className={cn(
                "p-1 h-6 w-6 rounded-full border-2 transition-all",
                assignment.completed 
                  ? "bg-primary-500 border-primary-500 text-white" 
                  : "border-slate-300 hover:border-primary-500"
              )}
            >
              {assignment.completed && <ApperIcon name="Check" size={12} />}
            </Button>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <ApperIcon name={getTypeIcon(assignment.type)} size={16} className="text-slate-500" />
                <h3 className={cn(
                  "font-medium",
                  assignment.completed ? "text-slate-500 line-through" : "text-slate-900"
                )}>
                  {assignment.title}
                </h3>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <span className="font-medium text-primary-600">{course?.name || "Unknown Course"}</span>
                <span>Due: {format(new Date(assignment.dueDate), "MMM d, yyyy")}</span>
                <span>{assignment.points} points</span>
              </div>
              {assignment.earnedPoints !== null && (
                <div className="text-sm text-slate-600 mt-1">
                  Score: {assignment.earnedPoints}/{assignment.points} 
                  ({Math.round((assignment.earnedPoints / assignment.points) * 100)}%)
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(assignment.priority)}>
              {assignment.priority}
            </Badge>
            {isOverdue && (
              <Badge variant="danger">
                <ApperIcon name="Clock" size={12} className="mr-1" />
                Overdue
              </Badge>
            )}
            {isDueSoon && !isOverdue && (
              <Badge variant="warning">
                <ApperIcon name="Clock" size={12} className="mr-1" />
                Due Soon
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(assignment)}
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentItem;