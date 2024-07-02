import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useCard = () => {
  const axiosSecuer = useAxiosSecure();
  const { user } = useAuth();

  const { refetch, data: card = [] } = useQuery({
    queryKey: ["myClasses", user?.email],
    queryFn: async () => {
      const res = await axiosSecuer.get(`/enroll?email=${user?.email}`);
      return res.data;
    },
  });
  return [card, refetch];
};

export default useCard;
