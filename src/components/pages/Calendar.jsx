import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from "date-fns";

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load calendar data. Please try again.");
      console.error("Calendar loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  const getSelectedDateAssignments = () => {
    return getAssignmentsForDate(selectedDate);
  };

  const generateCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startDate = new Date(start);
    startDate.setDate(startDate.getDate() - start.getDay()); // Start from Sunday
    
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + (6 - end.getDay())); // End at Saturday
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const getCourseColor = (courseId) => {
    const colors = [
      "bg-primary-100 text-primary-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-amber-100 text-amber-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800"
    ];
    return colors[courseId % colors.length];
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "border-red-500";
      case "Medium": return "border-amber-500";
      default: return "border-slate-300";
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <Error
          title="Calendar Error"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  const calendarDays = generateCalendarDays();
  const selectedDateAssignments = getSelectedDateAssignments();

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Academic Calendar</h1>
          <p className="text-slate-600 mt-1">
            View upcoming assignments and deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map(day => {
                  const dayAssignments = getAssignmentsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);
                  
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative p-2 text-sm min-h-[3rem] border rounded-lg transition-all hover:bg-slate-50
                        ${isCurrentMonth ? "text-slate-900" : "text-slate-400"}
                        ${isSelected ? "bg-primary-100 border-primary-300 text-primary-900" : "border-slate-200"}
                        ${isTodayDate ? "bg-primary-50 border-primary-200" : ""}
                      `}
                    >
                      <span className="block">{format(day, "d")}</span>
                      {dayAssignments.length > 0 && (
                        <div className="absolute bottom-1 left-1 right-1 flex justify-center">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        </div>
                      )}
                      {dayAssignments.length > 1 && (
                        <div className="absolute bottom-1 right-1">
                          <span className="text-xs bg-primary-500 text-white px-1 rounded-full">
                            {dayAssignments.length}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={20} className="text-primary-600" />
                <span>{format(selectedDate, "EEEE, MMMM d")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No assignments due on this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateAssignments.map(assignment => {
                    const course = courses.find(c => c.Id === assignment.courseId);
                    return (
                      <div
                        key={assignment.Id}
                        className={`p-3 rounded-lg border-l-4 bg-slate-50 ${getPriorityColor(assignment.priority)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 mb-1">
                              {assignment.title}
                            </h4>
                            <p className="text-sm text-slate-600 mb-2">
                              {course?.name || "Unknown Course"}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {assignment.type}
                              </Badge>
                              <Badge 
                                variant={assignment.priority === "High" ? "danger" : 
                                        assignment.priority === "Medium" ? "warning" : "secondary"}
                                className="text-xs"
                              >
                                {assignment.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900">
                              {assignment.points} pts
                            </p>
                            {assignment.completed && (
                              <div className="flex items-center space-x-1 mt-1">
                                <ApperIcon name="Check" size={12} className="text-green-600" />
                                <span className="text-xs text-green-600">Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Clock" size={20} className="text-amber-600" />
                <span>Upcoming Deadlines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const upcomingAssignments = assignments
                  .filter(a => !a.completed && new Date(a.dueDate) >= new Date())
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .slice(0, 5);

                if (upcomingAssignments.length === 0) {
                  return (
                    <div className="text-center py-6">
                      <ApperIcon name="CheckCircle" size={40} className="text-green-500 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">All caught up!</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {upcomingAssignments.map(assignment => {
                      const course = courses.find(c => c.Id === assignment.courseId);
                      const daysUntilDue = Math.ceil(
                        (new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
                      );
                      
                      return (
                        <div key={assignment.Id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded">
                          <div className={`w-2 h-2 rounded-full ${
                            daysUntilDue <= 1 ? "bg-red-500" :
                            daysUntilDue <= 3 ? "bg-amber-500" : "bg-primary-500"
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{assignment.title}</p>
                            <p className="text-xs text-slate-500">{course?.code || "Unknown"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-slate-600">
                              {daysUntilDue === 0 ? "Today" :
                               daysUntilDue === 1 ? "Tomorrow" :
                               `${daysUntilDue} days`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;