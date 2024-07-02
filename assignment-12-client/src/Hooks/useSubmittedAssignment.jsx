import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const useSubmittedAssignment = () => {
    const axiosPublic = useAxiosPublic()
    const { data: submitassignment = [], refetch } = useQuery({
        queryKey: ["submitassignment"],
        queryFn: async () => {
          const res = await axiosPublic.get("/submitassignment");
          return res.data;
        },
      });
      return [submitassignment, refetch];


};

export default useSubmittedAssignment;