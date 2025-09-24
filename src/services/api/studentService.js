const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const studentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_number_c"}}
        ],
        orderBy: [{"fieldName": "last_name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('students_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_number_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('students_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

async create(studentData) {
    try {
      // Ensure all required fields are present and properly formatted
      const firstName = (studentData.first_name_c || '').toString().trim();
      const lastName = (studentData.last_name_c || '').toString().trim();
      
      if (!firstName || !lastName) {
        throw new Error('First name and last name are required');
      }
      
      const params = {
        records: [
          {
            Name: studentData.Name || `${firstName} ${lastName}`,
            Tags: (studentData.Tags || '').toString().trim(),
            first_name_c: firstName,
            last_name_c: lastName,
            email_c: (studentData.email_c || '').toString().trim(),
            phone_number_c: (studentData.phone_number_c || '').toString().trim()
          }
        ]
      };
      
      const response = await apperClient.createRecord('students_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} students:`, failed);
          throw new Error("Failed to create student");
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No response data");
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
            Tags: studentData.Tags || "",
            first_name_c: studentData.first_name_c || "",
            last_name_c: studentData.last_name_c || "",
            email_c: studentData.email_c || "",
            phone_number_c: studentData.phone_number_c || ""
          }
        ]
      };
      
      const response = await apperClient.updateRecord('students_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} students:`, failed);
          throw new Error("Failed to update student");
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No response data");
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('students_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} students:`, failed);
          throw new Error("Failed to delete student");
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      throw error;
    }
  }
};