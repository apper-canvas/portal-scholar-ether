import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  gradient = "from-primary-500 to-primary-600"
}) => {
  return (
    <Card className={cn("overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div className={cn("p-2 rounded-lg bg-gradient-to-r", gradient)}>
            <ApperIcon name={icon} size={20} className="text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          {trend && (
            <div className={cn("flex items-center text-sm", 
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-slate-500"
            )}>
              {trend === "up" && <ApperIcon name="TrendingUp" size={16} className="mr-1" />}
              {trend === "down" && <ApperIcon name="TrendingDown" size={16} className="mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;