import { useEffect, useState } from "react";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const MyProfile = () => {
  const [info, setInfo] = useState([]);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    axiosSecure.get(`profile/${user.email}`).then((res) => {
      setInfo(res.data);
      console.log(res.data);
    });
  }, [axiosSecure, user]);
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <p>{user.name}</p>
        <img src={user?.photoURL} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <h1 className="text-5xl font-bold">Profile of- {info.name}</h1>
          <p className="py-6 text-3xl font-bold">Email- {info.email} </p>
          <p className="text-3xl font-bold">Role- Student</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
