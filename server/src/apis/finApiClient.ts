// src/services/externalApi/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.FIN_API_URL}`,
  timeout: 7200000, // 2 hrs
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error logging
    console.error("financials provider API Error:", {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });

    return Promise.reject(error);
  }
);

export default apiClient;
