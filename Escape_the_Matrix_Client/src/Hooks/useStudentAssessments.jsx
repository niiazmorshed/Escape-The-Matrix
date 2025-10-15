import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

// Get all assessments for student across all enrolled classes (dashboard)
const useStudentAssessments = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: assessments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["studentDashboardAssessments", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        console.warn("⚠️ No user email found");
        return [];
      }

      console.log(`🔍 Fetching dashboard assessments for: ${user.email}`);

      try {
        const endpoint = `/api/student/dashboard/assessments`;
        console.log(`🌐 Calling endpoint: ${endpoint}`);

        const res = await axiosSecure.get(endpoint);
        console.log(`✅ Success! Response:`, res.data);

        if (res.data?.success && Array.isArray(res.data.data)) {
          console.log(
            `📦 Found ${res.data.data.length} assessments across all classes`
          );
          return res.data.data;
        }

        console.warn("⚠️ Unexpected response format:", res.data);
        return [];
      } catch (err) {
        console.error(`❌ Failed to fetch dashboard assessments:`, {
          status: err?.response?.status,
          message: err?.response?.data?.message || err.message,
          error: err,
        });
        return [];
      }
    },
    enabled: !!user?.email,
  });

  console.log("useStudentAssessments hook state:", {
    count: assessments.length,
    isLoading,
    error,
    userEmail: user?.email,
  });

  return [assessments, isLoading, refetch];
};

export default useStudentAssessments;

