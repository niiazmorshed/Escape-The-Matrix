
import { FaBookOpen, FaGraduationCap, FaUsers } from "react-icons/fa";
import useCard from "../../../../Hooks/useCard";
import MyEnrollCard from "./MyEnrollCard";

const MyEnrollClass = () => {
  const [card, refetch] = useCard()

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <FaGraduationCap className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Enrolled Classes
            </h1>
            <p className="text-gray-600 text-lg">Continue your learning journey</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Classes</p>
                <p className="text-3xl font-bold text-primary">{card.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <FaBookOpen className="text-primary text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Classes</p>
                <p className="text-3xl font-bold text-secondary">{card.length}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <FaUsers className="text-secondary text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Progress</p>
                <p className="text-3xl font-bold text-accent">85%</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <FaGraduationCap className="text-accent text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      {card.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBookOpen className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Classes Enrolled</h3>
          <p className="text-gray-500 mb-6">Start your learning journey by enrolling in classes</p>
          <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Browse Classes
          </button>
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
