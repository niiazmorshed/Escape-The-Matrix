import { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaEnvelope, FaUser } from "react-icons/fa";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const TeacherProfile = () => {
    const [info, setInfo] = useState([])
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    axiosSecure.get(`profile/${user.email}`)
    .then(res=>{
        setInfo(res.data)
        console.log(res.data)
    })
  }, [axiosSecure, user]);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaChalkboardTeacher className="mr-3 text-blue-600" />
            Teacher Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Your teacher account information</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaUser className="mr-3" />
              Teacher Account
            </h2>
            <p className="text-blue-100 mt-1">Personal details and role information</p>
          </div>

          <div className="p-8 text-gray-900 dark:text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500/40">
                  <img
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Teacher'}&background=3B82F6&color=fff&size=128`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">
                  {info.name || user?.displayName || 'Teacher'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center md:justify-start">
                    <FaEnvelope className="text-blue-600 dark:text-blue-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-200">{info.email || user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                      {info.role || 'Teacher'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
