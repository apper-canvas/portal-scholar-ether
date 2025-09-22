import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import GPAWidget from "@/components/molecules/GPAWidget";
import StudyTimer from "@/components/molecules/StudyTimer";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { studySessionService } from "@/services/api/studySessionService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesData, assignmentsData, studyData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        studySessionService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
      setStudySessions(studyData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

const calculateGPA = () => {
    if (courses.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
      const gradePoints = ((course.current_grade_c || 0) / 100) * 4.0;
      totalPoints += gradePoints * (course.credits_c || 0);
      totalCredits += (course.credits_c || 0);
    });
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

const getUpcomingAssignments = () => {
    const upcoming = assignments
      .filter(assignment => !(assignment.completed_c))
      .sort((a, b) => new Date(a.due_date_c) - new Date(b.due_date_c))
      .slice(0, 5);
    return upcoming;
  };

  const getCompletedAssignments = () => {
    return assignments.filter(assignment => assignment.completed);
  };
const getTotalStudyTime = () => {
    const thisWeek = studySessions
      .filter(session => {
        const sessionDate = new Date(session.date_c);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate >= weekAgo;
      })
      .reduce((total, session) => total + (session.duration_c || 0), 0);
    
    return Math.round(thisWeek / 60); // Convert to minutes
  };

const handleToggleAssignment = async (assignmentId) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId);
      const updatedAssignment = { ...assignment, completed_c: !assignment.completed_c };
      
      await assignmentService.update(assignmentId, updatedAssignment);
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? updatedAssignment : a
      ));
      
      toast.success(
        updatedAssignment.completed_c ? "Assignment completed!" : "Assignment marked as incomplete"
      );
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

const handleSessionComplete = async (sessionData) => {
    try {
      const newSession = {
        course_id_c: parseInt(sessionData.courseId),
        duration_c: sessionData.duration,
        date_c: sessionData.date.toISOString(),
        notes_c: ""
      };
      
      await studySessionService.create(newSession);
      loadDashboardData(); // Reload data to get fresh from database
      toast.success("Study session completed!");
    } catch (err) {
      toast.error("Failed to save study session");
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <Loading variant="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <Error
          title="Dashboard Error"
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  const currentGPA = calculateGPA();
  const upcomingAssignments = getUpcomingAssignments();
  const completedCount = getCompletedAssignments().length;
  const studyTimeThisWeek = getTotalStudyTime();

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h1>
        <p className="text-slate-600">Here's your academic progress at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current GPA"
          value={currentGPA.toFixed(2)}
          icon="TrendingUp"
          gradient="from-primary-500 to-primary-600"
        />
        <StatCard
          title="Active Courses"
          value={courses.length}
          icon="BookOpen"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Completed Assignments"
          value={completedCount}
          icon="CheckCircle"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Study Time (This Week)"
          value={`${studyTimeThisWeek}m`}
          icon="Clock"
          gradient="from-amber-500 to-amber-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Assignments */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={20} className="text-primary-600" />
                  <span>Upcoming Assignments</span>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="ExternalLink" size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {upcomingAssignments.length === 0 ? (
                <Empty
                  icon="FileText"
                  title="No upcoming assignments"
                  message="You're all caught up! Great job staying on top of your work."
                  className="border-0 shadow-none"
                />
              ) : (
                <div className="space-y-3">
                  {upcomingAssignments.map(assignment => {
const course = courses.find(c => c.Id === assignment.course_id_c?.Id || assignment.course_id_c);
                    return (
                      <AssignmentItem
                        key={assignment.Id}
                        assignment={assignment}
                        course={course}
                        onToggleComplete={handleToggleAssignment}
                        onEdit={() => {}}
                        className="shadow-none border border-slate-100"
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Overview */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" size={20} className="text-primary-600" />
                <span>Course Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {courses.length === 0 ? (
                <Empty
                  icon="BookOpen"
                  title="No courses added"
                  message="Start by adding your courses to track your academic progress."
                  actionLabel="Add Course"
                  className="border-0 shadow-none"
                />
              ) : (
                <div className="space-y-4">
                  {courses.slice(0, 4).map(course => (
<div key={course.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">{course.name_c || course.Name}</h4>
                        <p className="text-sm text-slate-500">{course.code_c}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600">
                          {course.current_grade_c}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {course.credits_c} credits
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* GPA Widget */}
          <GPAWidget
            currentGPA={currentGPA}
            previousGPA={3.2}
            targetGPA={3.8}
          />

          {/* Study Timer */}
          <StudyTimer
            courses={courses}
            onSessionComplete={handleSessionComplete}
          />

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Assignment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="BookOpen" size={16} className="mr-2" />
                Add Course
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="Calculator" size={16} className="mr-2" />
                Calculate GPA
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;