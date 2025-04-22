import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useMyClass = () => {
  const axiosPublic = useAxiosPublic();
  const {
    data: classes = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["myclasses"],
    queryFn: async () => {
      const res = await axiosPublic.get("/classatadmin");
      return res.data;
    },
  });
  return [classes, loading, refetch];
};

export default useMyClass;
