const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const studySessionService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('study_session_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching study sessions:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('study_session_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching study session ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(sessionData) {
    try {
      const params = {
        records: [
          {
            Name: `Study Session - ${new Date(sessionData.date_c || sessionData.date).toLocaleDateString()}`,
            duration_c: sessionData.duration_c || sessionData.duration,
            date_c: sessionData.date_c || sessionData.date,
            notes_c: sessionData.notes_c || sessionData.notes || "",
            course_id_c: parseInt(sessionData.course_id_c || sessionData.courseId)
          }
        ]
      };
      
      const response = await apperClient.createRecord('study_session_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} study sessions:`, failed);
          throw new Error("Failed to create study session");
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No response data");
    } catch (error) {
      console.error("Error creating study session:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, sessionData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: sessionData.Name || `Study Session - ${new Date(sessionData.date_c || sessionData.date).toLocaleDateString()}`,
            duration_c: sessionData.duration_c || sessionData.duration,
            date_c: sessionData.date_c || sessionData.date,
            notes_c: sessionData.notes_c || sessionData.notes || "",
            course_id_c: parseInt(sessionData.course_id_c || sessionData.courseId)
          }
        ]
      };
      
      const response = await apperClient.updateRecord('study_session_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} study sessions:`, failed);
          throw new Error("Failed to update study session");
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No response data");
    } catch (error) {
      console.error("Error updating study session:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('study_session_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} study sessions:`, failed);
          throw new Error("Failed to delete study session");
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting study session:", error?.response?.data?.message || error);
      throw error;
    }
}
};