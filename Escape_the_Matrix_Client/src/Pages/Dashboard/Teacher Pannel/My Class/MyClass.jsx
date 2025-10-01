import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaPlus,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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

  // Status helper and filtering
  const getStatus = (c) => {
    if (c.status) return c.status;
    if (c.approved === true) return "approved";
    if (c.approved === false) return "pending";
    return "pending";
  };

  const [tab, setTab] = useState("approved"); // approved | rejected | pending
  const filtered = useMemo(
    () => myClass.filter((c) => getStatus(c) === tab),
    [myClass, tab]
  );
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaChalkboardTeacher className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Classes
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Manage your teaching courses
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/addclass")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <FaPlus className="text-base" />
            <span>Add New Class</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Total Classes
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {myClass.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FaBookOpen className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  156
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {["approved", "rejected", "pending"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              tab === t
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBookOpen className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">
            No Classes Found
          </h3>
          <button
            onClick={() => navigate("/dashboard/addclass")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Create Your First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2 md:px-4">
          {filtered.map((i, index) => (
            <div
              key={i._id}
              className="transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 100}
            >
              <MyClassCard card={i} refetch={refetch} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClass;
