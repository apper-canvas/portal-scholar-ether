import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "@/components/molecules/CourseCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    professor: "",
    credits: "",
    semester: "",
    currentGrade: "",
    targetGrade: ""
  });

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
      console.error("Courses loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      professor: "",
      credits: "",
      semester: "",
      currentGrade: "",
      targetGrade: ""
    });
    setEditingCourse(null);
    setShowAddForm(false);
  };

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      code: course.code,
      professor: course.professor,
      credits: course.credits.toString(),
      semester: course.semester,
      currentGrade: course.currentGrade.toString(),
      targetGrade: course.targetGrade.toString()
    });
    setEditingCourse(course);
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        currentGrade: parseFloat(formData.currentGrade),
        targetGrade: parseFloat(formData.targetGrade)
      };

      if (editingCourse) {
        const updatedCourse = { ...editingCourse, ...courseData };
        await courseService.update(editingCourse.Id, updatedCourse);
        setCourses(prev => prev.map(c => c.Id === editingCourse.Id ? updatedCourse : c));
        toast.success("Course updated successfully!");
      } else {
        const newCourse = {
          Id: Date.now(),
          ...courseData
        };
        await courseService.create(newCourse);
        setCourses(prev => [...prev, newCourse]);
        toast.success("Course added successfully!");
      }
      
      resetForm();
    } catch (err) {
      toast.error("Failed to save course");
      console.error("Course save error:", err);
    }
  };

  const handleViewAssignments = (courseId) => {
    navigate(`/assignments?course=${courseId}`);
  };

  const calculateOverallGPA = () => {
    if (courses.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
      const gradePoints = (course.currentGrade / 100) * 4.0;
      totalPoints += gradePoints * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
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
          title="Courses Error"
          message={error}
          onRetry={loadCourses}
        />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
          <p className="text-slate-600 mt-1">
            Manage your courses and track academic progress
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-600">Overall GPA</p>
            <p className="text-2xl font-bold text-primary-600">{calculateOverallGPA()}</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-primary-500 to-primary-600"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Add/Edit Course Form */}
      {showAddForm && (
        <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingCourse ? "Edit Course" : "Add New Course"}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <ApperIcon name="X" size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Course Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  placeholder="Introduction to Psychology"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Course Code
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({...prev, code: e.target.value}))}
                  placeholder="PSYC 101"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Professor
                </label>
                <Input
                  value={formData.professor}
                  onChange={(e) => setFormData(prev => ({...prev, professor: e.target.value}))}
                  placeholder="Dr. Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Credits
                </label>
                <Select
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({...prev, credits: e.target.value}))}
                  required
                >
                  <option value="">Select Credits</option>
                  <option value="1">1 Credit</option>
                  <option value="2">2 Credits</option>
                  <option value="3">3 Credits</option>
                  <option value="4">4 Credits</option>
                  <option value="5">5 Credits</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Semester
                </label>
                <Select
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({...prev, semester: e.target.value}))}
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Summer 2024">Summer 2024</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Grade (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.currentGrade}
                  onChange={(e) => setFormData(prev => ({...prev, currentGrade: e.target.value}))}
                  placeholder="85.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Grade (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.targetGrade}
                  onChange={(e) => setFormData(prev => ({...prev, targetGrade: e.target.value}))}
                  placeholder="90.0"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCourse ? "Update Course" : "Add Course"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="No courses added yet"
          message="Start building your academic profile by adding your courses. Track grades, manage assignments, and monitor your progress all in one place."
          actionLabel="Add Your First Course"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <CourseCard
              key={course.Id}
              course={course}
              onEdit={handleEdit}
              onViewAssignments={handleViewAssignments}
              className="hover:shadow-xl transition-all duration-300"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;