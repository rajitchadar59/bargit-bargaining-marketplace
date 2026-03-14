import axios from "axios";
import server from "./environment";

axios.defaults.baseURL = `${server}`;

// Request Interceptor
axios.interceptors.request.use((req) => {
  // 🌟 Admin ke liye specifically 'adminToken' use hoga
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  }
  return req;
});

// Response Interceptor
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isAuthRequest = err.config?.url?.includes('/login') || err.config?.url?.includes('/register');
      
      if (isAuthRequest) {
        return Promise.reject(err);
      }

      // 🌟 Sirf Admin ka data clear hoga 401 aane par
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRole");
      localStorage.removeItem("adminData");

      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default axios;