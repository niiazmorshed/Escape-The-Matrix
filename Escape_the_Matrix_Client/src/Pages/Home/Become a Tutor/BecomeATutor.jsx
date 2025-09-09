import { NavLink } from "react-router-dom";

const BecomeATutor = () => {
  return (
    <div data-aos="zoom-out" data-aos-duration="3000" className="py-16">
      <div className="text-center mb-12 px-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          Become a Teacher Today
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Join our community of expert educators and make a difference in the world of learning.
        </p>
      </div>
      
      <div className="hero bg-gradient-to-br from-base-200 to-base-300 rounded-3xl mx-4 shadow-2xl">
        <div className="hero-content grid p-8 md:grid-cols-2 gap-12">
          <div className="flex justify-center order-2 md:order-1">
            <div className="relative">
              <img
                src="https://i.ibb.co/YQ6P9Ym/22aeb26e3f4246e46c2e6735fd0a7f2f.jpg"
                className="max-w-sm rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                alt="Teacher"
              />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">👨‍🏫</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-full sm:full order-1 md:order-2">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Become an 
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Expert Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Global Reach</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Flexible Schedule</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Fair Earnings</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <NavLink to="/teachonemx">
                <button className="btn bg-primary text-white hover:bg-secondary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-xl px-8 py-4 text-lg font-semibold">
                  🚀 Start Teaching Today
                </button>
              </NavLink>
              <button className="btn btn-outline border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 rounded-xl px-8 py-4 text-lg font-semibold">
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
