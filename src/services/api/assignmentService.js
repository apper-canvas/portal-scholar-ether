const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const assignmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "earned_points_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "earned_points_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('assignment_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(assignmentData) {
    try {
      const params = {
        records: [
          {
            Name: assignmentData.title_c || assignmentData.title,
            title_c: assignmentData.title_c || assignmentData.title,
            type_c: assignmentData.type_c || assignmentData.type,
            due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
            points_c: assignmentData.points_c || assignmentData.points,
            earned_points_c: assignmentData.earned_points_c || assignmentData.earnedPoints,
            completed_c: assignmentData.completed_c || assignmentData.completed || false,
            priority_c: assignmentData.priority_c || assignmentData.priority,
            course_id_c: parseInt(assignmentData.course_id_c || assignmentData.courseId)
          }
        ]
      };
      
      const response = await apperClient.createRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} assignments:`, failed);
          throw new Error("Failed to create assignment");
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No response data");
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: assignmentData.title_c || assignmentData.title,
            title_c: assignmentData.title_c || assignmentData.title,
            type_c: assignmentData.type_c || assignmentData.type,
            due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
            points_c: assignmentData.points_c || assignmentData.points,
            earned_points_c: assignmentData.earned_points_c || assignmentData.earnedPoints,
            completed_c: assignmentData.completed_c !== undefined ? assignmentData.completed_c : assignmentData.completed,
            priority_c: assignmentData.priority_c || assignmentData.priority,
            course_id_c: parseInt(assignmentData.course_id_c || assignmentData.courseId)
          }
        ]
      };
      
      const response = await apperClient.updateRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} assignments:`, failed);
          throw new Error("Failed to update assignment");
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No response data");
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} assignments:`, failed);
          throw new Error("Failed to delete assignment");
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      throw error;
    }
}
};