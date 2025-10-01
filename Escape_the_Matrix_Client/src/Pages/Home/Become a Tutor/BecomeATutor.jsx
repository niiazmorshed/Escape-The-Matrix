import { NavLink } from "react-router-dom";

const BecomeATutor = () => {
  return (
    <div data-aos="zoom-out" data-aos-duration="3000" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-12 px-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
          Become a Teacher Today
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Join our community of expert educators and make a difference in the world of learning.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl ring-4 ring-blue-500/30 hover:ring-blue-500/60 transition-all duration-300">
              <img
                src="https://i.ibb.co/YQ6P9Ym/22aeb26e3f4246e46c2e6735fd0a7f2f.jpg"
                className="w-full max-w-md h-80 object-cover transform hover:scale-105 transition-transform duration-300"
                alt="Teacher"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">👨‍🏫</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-full sm:full order-1 md:order-2 text-gray-800 dark:text-white">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Become an 
              <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Instructor
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Unlock Your Potential as an Instructor with Escape the Matrix Today! Share your knowledge 
              and inspire learners worldwide by joining our community of expert educators. Benefit from 
              our comprehensive support and resources to create engaging, impactful courses.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Expert Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Global Reach</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Flexible Schedule</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Fair Earnings</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <NavLink to="/teachonemx">
                <button className="btn bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-xl px-8 py-4 text-lg font-semibold">
                  🚀 Start Teaching Today
                </button>
              </NavLink>
              <button className="btn btn-outline border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 rounded-xl px-8 py-4 text-lg font-semibold">
                📚 Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeATutor;
