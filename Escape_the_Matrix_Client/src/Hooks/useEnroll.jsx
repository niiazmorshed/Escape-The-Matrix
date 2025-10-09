
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useEnroll = () => {
    const axiosPublic = useAxiosPublic();
    const {
      data: enrollCount = 0,
      isPending: loading,
      refetch,
    } = useQuery({
      queryKey: ["enrollmentsCount"],
      queryFn: async () => {
        console.log("🔍 Fetching enrollment count from public endpoint...");
        try {
          const res = await axiosPublic.get("/enrollments/count");
          console.log("✅ Success! Enrollment count:", res.data.count);
          return res.data.count || 0;
        } catch (error) {
          console.log("❌ Failed to fetch enrollment count:", error.message);
          return 0;
        }
      },
    });
    return [enrollCount, loading, refetch];
};

export default useEnroll;