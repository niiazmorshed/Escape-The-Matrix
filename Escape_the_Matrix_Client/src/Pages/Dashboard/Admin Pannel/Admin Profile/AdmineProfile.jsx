import { useEffect, useState } from "react";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";


const AdmineProfile = () => {
    const {user} = useAuth();
    const [info, setInfo] = useState([]);
    const axiosSecure = useAxiosSecure
    ();
    useEffect(() => {
      axiosSecure.get(`profile/${user.email}`).then((res) => {
        setInfo(res.data);
      });
    }, [axiosSecure, user]);
    return (
        <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <p>{user.name}</p>
          <img src={user?.photoURL} className="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold">{info.name}</h1>
            <p className="py-6 text-3xl font-bold">Email- {info.email} </p>
            <p className="text-3xl font-bold">Role- {info.role}</p>
          </div>
        </div>
      </div>
    );
};

export default AdmineProfile;