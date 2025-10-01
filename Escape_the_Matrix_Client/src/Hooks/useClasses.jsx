import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useClasses = () => {
  const axiosPublic = useAxiosPublic();
  const {
    data: classes = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get("/classes");
        if (Array.isArray(res.data) && res.data.length > 0) {
          return res.data;
        }
        // Fallback: try admin/all route and filter approved
        const alt = await axiosPublic.get("/classes/admin");
        const data = Array.isArray(alt.data)
          ? alt.data.filter((c) => c.approved || c.status === "approved")
          : [];
        return data;
      } catch (e) {
        // Last fallback: return empty array
        return [];
      }
    },
  });
  return [classes, loading, refetch];
};

export default useClasses;
