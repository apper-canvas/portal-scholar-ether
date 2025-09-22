import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Assignments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [filterCourse, setFilterCourse] = useState(searchParams.get("course") || "");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    type: "",
    dueDate: "",
    points: "",
    earnedPoints: "",
    priority: "Medium"
  });

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
      setError("Failed to load assignments. Please try again.");
      console.error("Assignments loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      courseId: "",
      title: "",
      type: "",
      dueDate: "",
      points: "",
      earnedPoints: "",
      priority: "Medium"
    });
    setEditingAssignment(null);
    setShowAddForm(false);
  };

  const handleEdit = (assignment) => {
    setFormData({
      courseId: assignment.courseId.toString(),
      title: assignment.title,
      type: assignment.type,
      dueDate: format(new Date(assignment.dueDate), "yyyy-MM-dd"),
      points: assignment.points.toString(),
      earnedPoints: assignment.earnedPoints ? assignment.earnedPoints.toString() : "",
      priority: assignment.priority
    });
    setEditingAssignment(assignment);
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const assignmentData = {
        courseId: parseInt(formData.courseId),
        title: formData.title,
        type: formData.type,
        dueDate: new Date(formData.dueDate).toISOString(),
        points: parseFloat(formData.points),
        earnedPoints: formData.earnedPoints ? parseFloat(formData.earnedPoints) : null,
        priority: formData.priority,
        completed: !!formData.earnedPoints
      };

      if (editingAssignment) {
        const updatedAssignment = { ...editingAssignment, ...assignmentData };
        await assignmentService.update(editingAssignment.Id, updatedAssignment);
        setAssignments(prev => prev.map(a => a.Id === editingAssignment.Id ? updatedAssignment : a));
        toast.success("Assignment updated successfully!");
      } else {
        const newAssignment = {
          Id: Date.now(),
          ...assignmentData
        };
        await assignmentService.create(newAssignment);
        setAssignments(prev => [...prev, newAssignment]);
        toast.success("Assignment added successfully!");
      }
      
      resetForm();
    } catch (err) {
      toast.error("Failed to save assignment");
      console.error("Assignment save error:", err);
    }
  };

  const handleToggleComplete = async (assignmentId) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId);
      const updatedAssignment = { ...assignment, completed: !assignment.completed };
      
      await assignmentService.update(assignmentId, updatedAssignment);
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? updatedAssignment : a
      ));
      
      toast.success(
        updatedAssignment.completed ? "Assignment completed!" : "Assignment marked as incomplete"
      );
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  const getFilteredAssignments = () => {
    let filtered = assignments;

    if (filterCourse) {
      filtered = filtered.filter(a => a.courseId === parseInt(filterCourse));
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(a => {
        if (filterStatus === "completed") return a.completed;
        if (filterStatus === "pending") return !a.completed;
        if (filterStatus === "overdue") {
          return !a.completed && new Date(a.dueDate) < new Date();
        }
        return true;
      });
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter(a => a.priority === filterPriority);
    }

    return filtered.sort((a, b) => {
      // Sort by due date, with overdue items first
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      const now = new Date();
      
      const isOverdueA = dateA < now && !a.completed;
      const isOverdueB = dateB < now && !b.completed;
      
      if (isOverdueA && !isOverdueB) return -1;
      if (!isOverdueA && isOverdueB) return 1;
      
      return dateA - dateB;
    });
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <Loading variant="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <Error
          title="Assignments Error"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  const filteredAssignments = getFilteredAssignments();
  const completedCount = assignments.filter(a => a.completed).length;
  const overdueCount = assignments.filter(a => !a.completed && new Date(a.dueDate) < new Date()).length;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-600 mt-1">
            Track and manage your academic assignments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge variant="success">{completedCount} Completed</Badge>
            {overdueCount > 0 && (
              <Badge variant="danger">{overdueCount} Overdue</Badge>
            )}
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-primary-500 to-primary-600"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Assignment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.Id} value={course.Id}>{course.name}</option>
              ))}
            </Select>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </Select>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setFilterCourse("");
                setFilterStatus("all");
                setFilterPriority("all");
                setSearchParams({});
              }}
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Assignment Form */}
      {showAddForm && (
        <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingAssignment ? "Edit Assignment" : "Add New Assignment"}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <ApperIcon name="X" size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Course
                </label>
                <Select
                  value={formData.courseId}
                  onChange={(e) => setFormData(prev => ({...prev, courseId: e.target.value}))}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.Id} value={course.Id}>{course.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assignment Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                  placeholder="Midterm Exam"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({...prev, type: e.target.value}))}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Homework">Homework</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Exam">Exam</option>
                  <option value="Project">Project</option>
                  <option value="Essay">Essay</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({...prev, dueDate: e.target.value}))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total Points
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({...prev, points: e.target.value}))}
                  placeholder="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Earned Points (if completed)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.earnedPoints}
                  onChange={(e) => setFormData(prev => ({...prev, earnedPoints: e.target.value}))}
                  placeholder="85"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({...prev, priority: e.target.value}))}
                  required
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </Select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAssignment ? "Update Assignment" : "Add Assignment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <Empty
          icon="FileText"
          title={assignments.length === 0 ? "No assignments yet" : "No assignments match your filters"}
          message={assignments.length === 0 
            ? "Start organizing your academic life by adding your assignments. Track due dates, priorities, and completion status all in one place."
            : "Try adjusting your filters to see more assignments."
          }
          actionLabel={assignments.length === 0 ? "Add Your First Assignment" : "Clear Filters"}
          onAction={() => {
            if (assignments.length === 0) {
              setShowAddForm(true);
            } else {
              setFilterCourse("");
              setFilterStatus("all");
              setFilterPriority("all");
            }
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map(assignment => {
            const course = courses.find(c => c.Id === assignment.courseId);
            return (
              <AssignmentItem
                key={assignment.Id}
                assignment={assignment}
                course={course}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;