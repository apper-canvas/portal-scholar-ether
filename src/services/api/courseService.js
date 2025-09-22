const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const courseService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "professor_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "current_grade_c"}},
          {"field": {"Name": "target_grade_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "professor_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "current_grade_c"}},
          {"field": {"Name": "target_grade_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('course_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(courseData) {
    try {
      const params = {
        records: [
          {
            Name: courseData.name_c || courseData.name,
            name_c: courseData.name_c || courseData.name,
            code_c: courseData.code_c || courseData.code,
            credits_c: courseData.credits_c || courseData.credits,
            professor_c: courseData.professor_c || courseData.professor,
            semester_c: courseData.semester_c || courseData.semester,
            current_grade_c: courseData.current_grade_c || courseData.currentGrade,
            target_grade_c: courseData.target_grade_c || courseData.targetGrade
          }
        ]
      };
      
      const response = await apperClient.createRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} courses:`, failed);
          throw new Error("Failed to create course");
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No response data");
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, courseData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: courseData.name_c || courseData.name,
            name_c: courseData.name_c || courseData.name,
            code_c: courseData.code_c || courseData.code,
            credits_c: courseData.credits_c || courseData.credits,
            professor_c: courseData.professor_c || courseData.professor,
            semester_c: courseData.semester_c || courseData.semester,
            current_grade_c: courseData.current_grade_c || courseData.currentGrade,
            target_grade_c: courseData.target_grade_c || courseData.targetGrade
          }
        ]
      };
      
      const response = await apperClient.updateRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} courses:`, failed);
          throw new Error("Failed to update course");
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No response data");
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} courses:`, failed);
          throw new Error("Failed to delete course");
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      throw error;
}
  }
};