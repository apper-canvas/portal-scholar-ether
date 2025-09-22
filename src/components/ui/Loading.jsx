import React from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  const shimmer = "animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%]";

  if (variant === "cards") {
    return (
      <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className={cn("h-5 rounded", shimmer)} />
              <div className={cn("h-4 w-2/3 rounded", shimmer)} />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={cn("h-8 w-16 rounded-lg", shimmer)} />
                <div className={cn("h-4 rounded", shimmer)} />
                <div className={cn("h-4 w-3/4 rounded", shimmer)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className={cn("h-5 w-3/4 rounded", shimmer)} />
                <div className={cn("h-4 w-1/2 rounded", shimmer)} />
              </div>
              <div className="flex items-center space-x-3">
                <div className={cn("h-6 w-16 rounded-full", shimmer)} />
                <div className={cn("h-8 w-20 rounded-lg", shimmer)} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-12", className)}>
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
        <div className={cn("h-4 w-32 mx-auto rounded", shimmer)} />
      </div>
    </div>
  );
};

export default Loading;