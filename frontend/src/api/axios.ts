import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This tells the browser to send cookies!
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Just redirect, the cookie is either gone or expired
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
    }
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(
      new Error(Array.isArray(message) ? message.join(", ") : message),
    );
  },
);

export default apiClient;
