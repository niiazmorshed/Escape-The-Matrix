
import { FaBookOpen, FaGraduationCap, FaUsers } from 'react-icons/fa';
import { MdOutlineRefresh } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useCard from "../../../../Hooks/useCard";
import MyEnrollCard from "./MyEnrollCard";

const MyEnrollClass = () => {
  const [card, refetch] = useCard()
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Optional: Keep minimal logging for debugging
  console.log("📊 Enrolled courses:", card.length);

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                My Enrolled Classes
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Continue your learning journey</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="btn btn-outline btn-sm"
            title="Refresh enrollments"
          >
            <MdOutlineRefresh className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Classes</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{card.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <FaBookOpen className="text-primary text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Active Classes</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{card.length}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <FaUsers className="text-secondary text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner - Show only if there are enrollments */}
      {card.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-sm text-blue-800 dark:text-blue-200">
            <div>
              <p className="font-semibold">
                🎓 You're enrolled in <strong>{card.length}</strong> course{card.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs opacity-75 mt-1">
                Last enrollment: {new Date(card[0]?.enrolledDate).toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={() => refetch()}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}

      {/* Classes Grid */}
      {card.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBookOpen className="text-gray-400 dark:text-gray-500 text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No Classes Enrolled</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Start your learning journey by enrolling in classes</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/allclasses')} 
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Browse Classes
            </button>
            <button 
              onClick={() => refetch()} 
              className="btn btn-outline px-8 py-3 rounded-xl font-semibold"
            >
              Refresh Data
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {card.map((i, index) => (
            <div
              key={i._id}
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <MyEnrollCard
                enrollCard={i}
                refetch={refetch}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrollClass;
