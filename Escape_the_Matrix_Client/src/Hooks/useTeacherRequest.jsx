import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useTeacherRequest = () => {
  const axiosSecuer = useAxiosSecure();

  const { data: req = [], refetch } = useQuery({
    queryKey: ["teacherRequest"],
    queryFn: async () => {
      const res = await axiosSecuer.get("/teacherreq");
      return res.data;
    },
  });
  return [req, refetch];
};

export default useTeacherRequest;
