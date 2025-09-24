import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { studentService } from '@/services/api/studentService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
const [formData, setFormData] = useState({
    first_name_c: '',
    last_name_c: '',
    email_c: '',
    phone_number_c: '',
    Tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({
      first_name_c: '',
      last_name_c: '',
      email_c: '',
      phone_number_c: '',
      Tags: ''
    });
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      first_name_c: student.first_name_c || '',
      last_name_c: student.last_name_c || '',
      email_c: student.email_c || '',
      phone_number_c: student.phone_number_c || '',
      Tags: student.Tags || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name_c.trim() || !formData.last_name_c.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    if (formData.email_c && !/\S+@\S+\.\S+/.test(formData.email_c)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setSubmitting(true);
      
const studentData = {
        first_name_c: (formData.first_name_c || '').trim(),
        last_name_c: (formData.last_name_c || '').trim(),
        email_c: (formData.email_c || '').trim(),
        phone_number_c: (formData.phone_number_c || '').trim(),
        Tags: (formData.Tags || '').trim(),
        Name: `${(formData.first_name_c || '').trim()} ${(formData.last_name_c || '').trim()}`.trim()
      };

      if (editingStudent) {
        await studentService.update(editingStudent.Id, studentData);
        toast.success('Student updated successfully');
      } else {
        await studentService.create(studentData);
        toast.success('Student added successfully');
      }
      
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.message || 'Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.Name}?`)) {
      return;
    }

    try {
      await studentService.delete(student.Id);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchStudents} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-600 mt-1">Manage student information</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Student
        </Button>
      </div>

      {students.length === 0 ? (
        <Empty 
          icon="Users"
          title="No students found"
          description="Get started by adding your first student"
          action={
            <Button onClick={handleAdd} className="mt-4">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Student
            </Button>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700">Name</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Email</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Phone</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Tags</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.Id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{student.Name}</div>
                      <div className="text-sm text-slate-600">
                        {student.first_name_c} {student.last_name_c}
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">{student.email_c || '-'}</td>
                    <td className="p-4 text-slate-700">{student.phone_number_c || '-'}</td>
                    <td className="p-4">
                      {student.Tags ? (
                        <div className="flex flex-wrap gap-1">
                          {student.Tags.split(',').map((tag, index) => (
                            <Badge key={index} variant="secondary" size="sm">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingStudent ? 'Edit Student' : 'Add Student'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="first_name_c"
                  value={formData.first_name_c}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="last_name_c"
                  value={formData.last_name_c}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                name="email_c"
                value={formData.email_c}
                onChange={handleInputChange}
              />

              <Input
                label="Phone Number"
                name="phone_number_c"
                value={formData.phone_number_c}
                onChange={handleInputChange}
              />

              <Input
                label="Tags"
                name="Tags"
                value={formData.Tags}
                onChange={handleInputChange}
                placeholder="Comma separated tags"
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingStudent ? 'Update' : 'Add')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;