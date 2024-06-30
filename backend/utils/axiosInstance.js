import axios from "axios";
import jwt_decode from "jwt-decode";

// Create an Axios instance
const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add a request interceptor to include the token in headers
instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token is expired, refresh it
        try {
          const response = await axios.post(
            "http://localhost:5000/api/refresh",
            {
              token: refreshToken,
            }
          );
          const { newToken, newRefreshToken } = response.data;
          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          // Handle error (e.g., redirect to login)
          console.error("Error refreshing token", error);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized error:", error);
      // Redirect to login page or handle token refresh if applicable
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
