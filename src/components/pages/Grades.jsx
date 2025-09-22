import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
      console.error("Grades loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateGPA = (coursesList) => {
    if (coursesList.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;
    
    coursesList.forEach(course => {
      const gradePoints = (course.currentGrade / 100) * 4.0;
      totalPoints += gradePoints * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

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

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
  };

  const getCourseAssignments = (courseId) => {
    return assignments.filter(a => a.courseId === courseId && a.completed);
  };

  const getFilteredCourses = () => {
    if (selectedSemester === "all") return courses;
    return courses.filter(course => course.semester === selectedSemester);
  };

  const getSemesters = () => {
    const semesters = [...new Set(courses.map(course => course.semester))];
    return semesters.sort();
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <Loading variant="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <Error
          title="Grades Error"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  const filteredCourses = getFilteredCourses();
  const overallGPA = calculateGPA(filteredCourses);
  const semesters = getSemesters();
  const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grades</h1>
          <p className="text-slate-600 mt-1">
            Track your academic performance across all courses
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="min-w-[200px]"
          >
            <option value="all">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* GPA Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">
                  {selectedSemester === "all" ? "Overall GPA" : `${selectedSemester} GPA`}
                </p>
                <p className="text-3xl font-bold mt-1">{overallGPA.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <ApperIcon name="TrendingUp" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Credits</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalCredits}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ApperIcon name="BookOpen" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Courses</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{filteredCourses.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ApperIcon name="Award" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grade Breakdown */}
      {filteredCourses.length === 0 ? (
        <Empty
          icon="BarChart3"
          title="No courses found"
          message={selectedSemester === "all" 
            ? "Start adding courses to track your academic progress and GPA."
            : "No courses found for the selected semester."
          }
          actionLabel={selectedSemester === "all" ? "Add Course" : "View All Semesters"}
          onAction={() => {
            if (selectedSemester === "all") {
              // Navigate to courses page (would need useNavigate)
            } else {
              setSelectedSemester("all");
            }
          }}
        />
      ) : (
        <div className="space-y-6">
          {filteredCourses.map(course => {
            const courseAssignments = getCourseAssignments(course.Id);
            const letterGrade = getLetterGrade(course.currentGrade);
            
            return (
              <Card key={course.Id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <p className="text-slate-600 mt-1">{course.code} • {course.professor}</p>
                      <p className="text-sm text-slate-500">{course.semester} • {course.credits} Credits</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant={getGradeBadgeVariant(course.currentGrade)} className="text-base px-3 py-1">
                          {letterGrade}
                        </Badge>
                        <div className={`text-2xl font-bold ${getGradeColor(course.currentGrade)}`}>
                          {course.currentGrade.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        Target: {course.targetGrade}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                {courseAssignments.length > 0 && (
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                      <ApperIcon name="FileText" size={16} className="mr-2 text-slate-500" />
                      Completed Assignments ({courseAssignments.length})
                    </h4>
                    <div className="space-y-2">
                      {courseAssignments.slice(0, 5).map(assignment => (
                        <div key={assignment.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-1 bg-green-100 rounded">
                              <ApperIcon name="Check" size={14} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{assignment.title}</p>
                              <p className="text-sm text-slate-500">{assignment.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">
                              {assignment.earnedPoints}/{assignment.points}
                            </p>
                            <p className={`text-sm font-medium ${getGradeColor(
                              (assignment.earnedPoints / assignment.points) * 100
                            )}`}>
                              {Math.round((assignment.earnedPoints / assignment.points) * 100)}%
                            </p>
                          </div>
                        </div>
                      ))}
                      {courseAssignments.length > 5 && (
                        <p className="text-sm text-slate-500 text-center py-2">
                          +{courseAssignments.length - 5} more assignments
                        </p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Grades;