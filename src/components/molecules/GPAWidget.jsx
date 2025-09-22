import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const GPAWidget = ({ currentGPA, previousGPA, targetGPA, className }) => {
  const gpaChange = currentGPA - previousGPA;
  const isImproving = gpaChange > 0;
  const progressPercentage = Math.min((currentGPA / targetGPA) * 100, 100);

  const getGPAColor = (gpa) => {
    if (gpa >= 3.5) return "text-green-600";
    if (gpa >= 3.0) return "text-primary-600";
    if (gpa >= 2.5) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Current GPA</span>
          <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
            <ApperIcon name="TrendingUp" size={20} className="text-white" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={cn("text-4xl font-bold", getGPAColor(currentGPA))}>
              {currentGPA.toFixed(2)}
            </div>
            <div className="flex items-center justify-center mt-2 text-sm">
              {gpaChange !== 0 && (
                <>
                  <ApperIcon 
                    name={isImproving ? "TrendingUp" : "TrendingDown"} 
                    size={16} 
                    className={cn("mr-1", isImproving ? "text-green-600" : "text-red-600")}
                  />
                  <span className={cn(isImproving ? "text-green-600" : "text-red-600")}>
                    {isImproving ? "+" : ""}{gpaChange.toFixed(2)}
                  </span>
                  <span className="text-slate-500 ml-1">from last semester</span>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress to Target</span>
              <span className="font-medium">{targetGPA.toFixed(1)}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 text-center">
              {progressPercentage.toFixed(0)}% of target achieved
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GPAWidget;