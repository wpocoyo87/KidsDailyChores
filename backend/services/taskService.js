// backend/services/taskService.js

import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const createTask = async (kidId, taskData, token) => {
  try {
    const response = await axios.post(`${API_URL}/${kidId}/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTasks = async (kidId, date, token) => {
  try {
    const response = await axios.get(`${API_URL}/${kidId}/tasks`, {
      params: { date: date.toISOString() },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (kidId, taskId, token) => {
  try {
    await axios.delete(`${API_URL}/${kidId}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};
