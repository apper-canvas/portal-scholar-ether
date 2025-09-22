import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StudyTimer = ({ courses, onSessionComplete, className }) => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionType, setSessionType] = useState("study"); // study or break

  useEffect(() => {
    let intervalId = null;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(intervalId);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (sessionType === "study") {
      // Study session completed, start break
      setIsBreak(true);
      setSessionType("break");
      setTimeLeft(5 * 60); // 5 minute break
      if (onSessionComplete) {
        onSessionComplete({
courseId: selectedCourseId,
          duration: 25 * 60,
          date: new Date(),
          type: "study"
        });
      }
    } else {
      // Break completed, reset
      setIsBreak(false);
      setSessionType("study");
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => {
    if (!selectedCourseId && sessionType === "study") return;
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionType === "study" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progress = sessionType === "study" 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{isBreak ? "Break Time" : "Study Timer"}</span>
          <div className={cn(
            "p-2 rounded-lg bg-gradient-to-r",
            isActive ? "from-green-500 to-green-600" : "from-primary-500 to-primary-600"
          )}>
            <ApperIcon name={isActive ? "Pause" : "Play"} size={20} className="text-white" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isBreak && (
          <Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={isActive}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id}>{course.name}</option>
            ))}
          </Select>
        )}

        <div className="text-center space-y-3">
          <div className={cn(
            "text-4xl font-bold",
            isBreak ? "text-green-600" : "text-primary-600"
          )}>
            {formatTime(timeLeft)}
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-1000",
                isBreak 
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-primary-500 to-primary-600"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-sm text-slate-600">
            {isBreak 
              ? "Take a break! You've earned it." 
              : selectedCourseId 
? `Studying ${courses.find(c => c.Id === parseInt(selectedCourseId))?.name_c || courses.find(c => c.Id === parseInt(selectedCourseId))?.Name}`
                : "Select a course to start studying"
            }
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={toggleTimer}
            disabled={!selectedCourseId && sessionType === "study"}
            className="flex-1"
            variant={isActive ? "outline" : "default"}
          >
            <ApperIcon name={isActive ? "Pause" : "Play"} size={16} className="mr-2" />
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button
            onClick={resetTimer}
            variant="ghost"
            size="default"
          >
            <ApperIcon name="RotateCcw" size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyTimer;