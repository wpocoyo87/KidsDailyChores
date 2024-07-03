import axios from "axios";

const API_URL = "http://localhost:5000/api";
const registerUserService = async (username, email, password, kids) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, {
      username,
      email,
      password,
      kids,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

const addTaskToKid = async (kidId, description, image, date) => {
  try {
    const response = await axios.post(`${API_URL}/kids/${kidId}/tasks`, {
      description,
      image,
      date,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding task to kid:", error);
    throw error;
  }
};

export default {
  registerUserService,
  loginUser,
  addTaskToKid,
};
