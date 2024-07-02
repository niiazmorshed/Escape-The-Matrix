import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import MyClassCard from "./MyClassCard";

const MyClass = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: myClass = [], refetch } = useQuery({
    queryKey: ["myClass"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/teacherclass/${user.email}`);
      console.log(res);
      return res.data;
    },
  });

  return (
    <div className="my-6">
      <h2 className="text-4xl font-bold text-center">My Added Class</h2>
      <div className="md:grid md:grid-cols-3 gap-6 mt-20 m-12">
        
        {myClass.map((i) => (
          <MyClassCard key={i._id} card={i} refetch={refetch}></MyClassCard>
        ))}
      </div>
    </div>
  );
};

export default MyClass;
