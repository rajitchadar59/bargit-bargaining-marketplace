import axios from "axios";
import server from "./environment";

axios.defaults.baseURL = `${server}`;


axios.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {

     
      const isAuthRequest = err.config?.url?.includes('/login') || err.config?.url?.includes('/register');
      
      if (isAuthRequest) {
        return Promise.reject(err);
      }


      const role = localStorage.getItem("role");
      let redirectUrl = "/auth";

      if (role === "vendor") {
        redirectUrl = "/vendor/auth";
      } else if (role === "admin") {
        redirectUrl = "/admin/auth";
      }

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");

      window.location.href = redirectUrl;
    }
    return Promise.reject(err);
  }
);

export default axios;