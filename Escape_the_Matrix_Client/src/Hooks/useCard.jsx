import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useCard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { refetch, data: card = [], isLoading, error } = useQuery({
    queryKey: ["myEnrollments", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        console.warn("⚠️ No user email found");
        return [];
      }
      
      console.log("🔍 Fetching enrollments for:", user.email);
      
      try {
        // Use the new backend endpoint: GET /enrollments/:email
        const endpoint = `/enrollments/${user.email}`;
        console.log(`🌐 Calling endpoint: ${endpoint}`);
        
        const res = await axiosSecure.get(endpoint);
        console.log(`✅ Success! Response:`, res.data);
        
        // Backend returns array of enrollments with populated classDetails
        if (Array.isArray(res.data)) {
          console.log(`📦 Found ${res.data.length} enrollments for ${user.email}`);
          return res.data;
        }
        
        console.warn("⚠️ Unexpected response format:", res.data);
        return [];
        
      } catch (err) {
        console.error(`❌ Failed to fetch enrollments:`, {
          status: err?.response?.status,
          message: err?.response?.data?.message || err.message,
          error: err
        });
        return [];
      }
    },
    enabled: !!user?.email,
  });

  // Debug logging
  console.log("useCard hook state:", { card, isLoading, error, userEmail: user?.email });
  return [card, refetch];
};

export default useCard;
