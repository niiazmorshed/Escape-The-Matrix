import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://escape-the-matrix-server.vercel.app",
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
