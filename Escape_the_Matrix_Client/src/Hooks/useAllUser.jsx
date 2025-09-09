import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useAllUser = () => {
  const axiosSecure = useAxiosSecure();

  const { data: userS = [], refetch } = useQuery({
    queryKey: ["allUsers"],
    enabled: !!localStorage.getItem("Access-Token"),
    queryFn: async () => {
      const res = await axiosSecure.get("/allusers");
      return res.data;
    },
  });
  return [userS, refetch];
};

export default useAllUser;
