import axios from "axios";

const API_URL = "http://KidsDailyCore.com/api"; // Replace with your actual API URL

export const getChecklist = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    // Handle error gracefully (e.g., logging, error state, etc.)
    console.error("Error fetching checklist:", error);
    throw error; // Rethrow or handle as needed
  }
};

// Export other service functions as needed (addChecklistItem, updateChecklistItem, deleteChecklistItem, etc.)
// Fungsi untuk menambahkan item checklist
export const addChecklistItem = async (data) => {
  try {
    const response = await axios.post(`${API_URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding checklist item:", error);
    throw error;
  }
};

// Fungsi untuk memperbarui item checklist
export const updateChecklistItem = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating checklist item:", error);
    throw error;
  }
};

// Fungsi untuk menghapus item checklist
export const deleteChecklistItem = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    throw error;
  }
};
