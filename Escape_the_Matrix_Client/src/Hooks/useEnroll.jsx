
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const useEnroll = () => {
    const axiosPublic = useAxiosPublic();
    const {
      data: enroll = [],
      isPending: loading,
      refetch,
    } = useQuery({
      queryKey: ["enroll"],
      queryFn: async () => {
        const res = await axiosPublic.get("/enrollall");
        return res.data;
      },
    });
    return [enroll, loading, refetch];
};

export default useEnroll;