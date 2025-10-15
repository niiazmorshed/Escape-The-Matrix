import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "https://escape-the-matrix-server.vercel.app",
});
const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  // Requrst interceptors to add authorization header  for every single call to the api
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("Access-Token");
      console.log("Request Stopped By Interceptors");
      config.headers.authorization = `Bearer ${token} `;
      return config;
    },
    function (error) {
      // Do Something with request error
      return Promise.reject(error);
    }
  );

  // Intercepts 401 and 403 status
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },

    async (error) => {
      const status = error.response.status;
      // For 401 or 403  logout the user and move the user to the login page
      if (status === 401 || status === 403) {
        await logOut();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
