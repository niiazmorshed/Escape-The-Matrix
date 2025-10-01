import { NavLink } from "react-router-dom";

const BecomeATutor = () => {
  return (
    <div data-aos="fade-up" data-aos-duration="800" className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Full-width banner style (match hero) */}
        <section className="relative overflow-hidden h-[50vh] rounded-2xl shadow-2xl w-full group">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://i.ibb.co/YQ6P9Ym/22aeb26e3f4246e46c2e6735fd0a7f2f.jpg)' }}
          />
          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/50 to-black/80" />
          {/* Decorative particles (optional) */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-16 h-16 bg-blue-500/20 rounded-full animate-pulse" />
            <div className="absolute bottom-12 right-16 w-14 h-14 bg-purple-500/20 rounded-full animate-ping" />
          </div>

          {/* Centered overlay content */}
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">Become an Instructor</h2>
            <p className="text-lg md:text-xl text-gray-200 mb-6">Inspire learners worldwide</p>
            <NavLink to="/teachonemx">
              <button className="group/btn relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 text-lg overflow-hidden">
                <span className="relative z-10 flex items-center">
                  <span className="mr-3">🚀</span>
                  Start Teaching Today
                  <svg className="ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
              </button>
            </NavLink>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BecomeATutor;
