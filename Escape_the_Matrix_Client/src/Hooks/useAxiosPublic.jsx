import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://escape-the-matrix-sigma.vercel.app",
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
