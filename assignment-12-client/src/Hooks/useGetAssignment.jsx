import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useGetAssignment = () => {
  const axiosSecuer = useAxiosSecure();
  const { user } = useAuth();

  const { refetch, data: assignment = [] } = useQuery({
    queryKey: ["getassignment", user?.email],
    queryFn: async () => {
      const res = await axiosSecuer.get(`/getassignment/${user?.email}`);
      return res.data;
    },
  });
  return [assignment, refetch];
  
};

export default useGetAssignment;