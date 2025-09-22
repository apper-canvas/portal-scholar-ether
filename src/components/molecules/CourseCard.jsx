import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CourseCard = ({ course, onEdit, onViewAssignments, className }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-primary-600";
    if (grade >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getGradeBadgeVariant = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "default";
    if (grade >= 70) return "warning";
    return "danger";
  };

  return (
    <Card className={cn("overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1">{course.name}</CardTitle>
            <p className="text-sm text-slate-500 font-medium">{course.code}</p>
            <p className="text-sm text-slate-600 mt-1">{course.professor}</p>
          </div>
          <Badge variant={getGradeBadgeVariant(course.currentGrade)}>
            {course.currentGrade}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Credits:</span>
            <span className="font-medium">{course.credits}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Target:</span>
            <span className={cn("font-medium", getGradeColor(course.targetGrade))}>
              {course.targetGrade}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Semester:</span>
            <span className="font-medium">{course.semester}</span>
          </div>
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewAssignments(course.Id)}
              className="flex-1"
            >
              <ApperIcon name="FileText" size={14} className="mr-1" />
              Assignments
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(course)}
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;