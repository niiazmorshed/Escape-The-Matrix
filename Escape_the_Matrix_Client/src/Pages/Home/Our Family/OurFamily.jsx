import useAllUser from "../../../Hooks/useAllUser";
import useEnroll from "../../../Hooks/useEnroll";
import useMyClass from "../../../Hooks/useMyClass";

const OurFamily = () => {
  const [userS] = useAllUser();
  const [classes] = useMyClass();
  const [enrollCount] = useEnroll();
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="text-center mt-12 mb-8">
        <h1 className="text-4xl font-semibold text-gray-800 dark:text-white">Our Family</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Join thousands of learners and educators in our vibrant platform</p>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-10 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden ring-4 ring-blue-500/40 transition-all duration-300 hover:ring-blue-600 hover:scale-105">
              <img
                src={`https://i.ibb.co/BKn7gy6/junior-ferreira-7es-RPTt38n-I-unsplash-1.jpg`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-gray-800 dark:text-white">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Users</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userS.length}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Classes</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{classes.length}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Enrollment</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{enrollCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurFamily;
