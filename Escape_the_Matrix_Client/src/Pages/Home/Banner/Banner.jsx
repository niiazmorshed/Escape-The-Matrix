import { Link } from "react-router-dom";
import {
    A11y,
    EffectFade,
    Navigation,
    Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import useAllUser from "../../../Hooks/useAllUser";
import useEnroll from "../../../Hooks/useEnroll";
import useMyClass from "../../../Hooks/useMyClass";

const Banner = () => {
  const [userS] = useAllUser();
  const [classes] = useMyClass();
  const [enroll] = useEnroll();
  return (
    <Swiper
      modules={[Navigation, Scrollbar, A11y, EffectFade]}
      spaceBetween={50}
      slidesPerView={1}
      effect="fade"
      navigation
      scrollbar={{ draggable: true }}
      // autoplay={{delay: 1500}}
      
    >
      <SwiperSlide>
        <section className="banner1 relative overflow-hidden h-[60vh] rounded-2xl shadow-2xl w-full group">
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/60 to-black/90"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-16 w-16 h-16 bg-purple-500/20 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-cyan-500/20 rounded-full animate-ping"></div>
          </div>
          
          {/* Main Content - Stats + Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            {/* Stats (moved from OurFamily) */}
            <div className="mb-6 grid grid-cols-3 gap-4 w-full max-w-xl animate-fade-in">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 text-center">
                <div className="text-xs text-gray-200">Total Users</div>
                <div className="text-2xl font-bold text-blue-300">{userS.length}</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 text-center">
                <div className="text-xs text-gray-200">Total Classes</div>
                <div className="text-2xl font-bold text-purple-300">{classes.length}</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 text-center">
                <div className="text-xs text-gray-200">Total Enrollment</div>
                <div className="text-2xl font-bold text-cyan-300">{enroll.length}</div>
              </div>
            </div>
            {/* Enhanced CTA Button */}
            <div className="animate-slide-up">
              <Link to="/allclasses">
                <button className="group/btn relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 text-lg overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <span className="mr-3">🚀</span>
                    Explore Classes
                    <svg className="ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
                </button>
              </Link>
            </div>
          </div>
          
          {/* Floating Chess Pieces Animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-16 h-16 opacity-30 animate-float">
              <div className="w-full h-full bg-white/20 rounded-lg transform rotate-12"></div>
            </div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 opacity-20 animate-float-delayed">
              <div className="w-full h-full bg-white/20 rounded-lg transform -rotate-12"></div>
            </div>
            <div className="absolute bottom-1/4 left-1/3 w-14 h-14 opacity-25 animate-float-slow">
              <div className="w-full h-full bg-white/20 rounded-lg transform rotate-45"></div>
            </div>
          </div>
        </section>
      </SwiperSlide>
    </Swiper>
  );
};

export default Banner;
