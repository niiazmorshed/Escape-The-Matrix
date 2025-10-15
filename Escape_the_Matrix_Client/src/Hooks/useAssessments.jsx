import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAssessments = (classId) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: assessments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["assessments", classId, user?.email],
    queryFn: async () => {
      if (!user?.email || !classId) {
        console.warn("⚠️ No user email or classId found");
        return [];
      }

      console.log(`🔍 Fetching assessments for class: ${classId}`);

      try {
        const endpoint = `/api/student/class/${classId}/assessments`;
        console.log(`🌐 Calling endpoint: ${endpoint}`);

        const res = await axiosSecure.get(endpoint);
        console.log(`✅ Success! Response:`, res.data);

        if (res.data?.success && Array.isArray(res.data.data)) {
          console.log(`📦 Found ${res.data.data.length} assessments`);
          return res.data.data;
        }

        console.warn("⚠️ Unexpected response format:", res.data);
        return [];
      } catch (err) {
        console.error(`❌ Failed to fetch assessments:`, {
          status: err?.response?.status,
          message: err?.response?.data?.message || err.message,
          error: err,
        });
        return [];
      }
    },
    enabled: !!user?.email && !!classId,
  });

  console.log("useAssessments hook state:", {
    assessments,
    isLoading,
    error,
    classId,
    userEmail: user?.email,
  });

  return [assessments, isLoading, refetch];
};

export default useAssessments;

