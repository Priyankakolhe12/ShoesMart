import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

/* =============================
   REQUEST INTERCEPTOR
============================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ changed

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =============================
   RESPONSE INTERCEPTOR
============================= */
api.interceptors.response.use(
  (response) => response, // ✅ return full response
  (error) => {
    const errorObj = {
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
      status: error?.response?.status || 500,
      data: error?.response?.data || null,
    };

    console.error("API Error:", errorObj);

    return Promise.reject(errorObj);
  },
);

export default api;
