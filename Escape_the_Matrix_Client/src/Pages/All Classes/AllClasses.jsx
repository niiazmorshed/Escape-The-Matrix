import { Helmet } from "react-helmet";
import useClasses from "../../Hooks/useClasses";
import Navbar from "../Navbar/Navbar";
import AllClassCard from "./AllClassCard";

const AllClasses = () => {
  const [classes] = useClasses();

  const approvedClasses = Array.isArray(classes)
    ? classes.filter((c) => c.approved || c.status === 'approved')
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Helmet>
        <meta charSet="utf-8" />
        <title>{"All Classes"}|EMX</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Navbar></Navbar>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Explore All Classes
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Browse our curated list of approved courses and start learning today.
          </p>
        </div>

        {/* Cards Grid */}
        {approvedClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedClasses.map((i) => (
              <AllClassCard key={i._id} cla={i}></AllClassCard>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-xl font-bold">EMX</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                No classes available yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Please check back later for newly approved courses.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllClasses;
