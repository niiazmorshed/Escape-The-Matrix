import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useTeacher = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: isTeacher, isPending: isTeacherLoading, refetch } = useQuery({
    queryKey: [user?.email, "isTeacher"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/teacher/${user.email}`);
      console.log(res.data);
      return res.data?.teacher;
    },
  });
  return [isTeacher, isTeacherLoading,refetch];
};

export default useTeacher;
