import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.medconnect.in",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Variables to handle simultaneous 401 intercept requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Triggered when Access Token has expired
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Fire request to refresh the token (cookie is automatically sent)
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/api/private-chamber/refresh`,
          {},
          { withCredentials: true },
        );
        const { accessToken } = refreshResponse.data;
        localStorage.setItem("accessToken", accessToken);

        // Update authorization headers
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        // Release the queued requests with the new token
        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired or invalid: force user to log out
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("clinic_doctor");
        window.location.href = "/private-chamber/login";
        return Promise.reject(refreshError);
      }
    }

    // If it's a 401 and we ALREADY retried (or it's an unrelated auth error), force logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("clinic_doctor");
      window.location.href = "/private-chamber/login";
    }

    return Promise.reject(error);
  },
);

export default api;
