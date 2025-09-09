import {
    A11y,
    EffectFade,
    Navigation,
    Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const Banner = () => {
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
        <section className="banner1 relative overflow-hidden">
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
          
          <section className="pt-32 relative z-10">
            <div className="md:flex flex-col justify-center text-center items-center gap-8 md:pt-6 px-4">
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="animate__animated animate__zoomIn md:text-6xl sm:text-3xl text-white font-extrabold md:w-4/5 text-center leading-tight">
                  Learn, Explore And Wonder with 
                  <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Escape Matrix
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="animate__animated animate__lightSpeedInRight font-normal text-white/90 md:text-xl md:w-2/3 text-center leading-relaxed">
                  Join us to escape the matrix and unlock your potential. We will teach you how to succeed 
                  and prepare you for making a real difference in the world today.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="animate__animated animate__lightSpeedInLeft flex flex-col sm:flex-row gap-4 mt-8">
                <button className="btn rounded-2xl bg-primary text-white hover:bg-secondary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl px-8 py-4 text-lg font-semibold">
                  🚀 Explore Now
                </button>
                <button className="btn btn-outline rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold">
                  💬 Our Feedback
                </button>
              </div>

              {/* Stats or Features */}
              <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/80">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">1000+</div>
                  <div className="text-sm">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm">Success Rate</div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </SwiperSlide>
    </Swiper>
  );
};

export default Banner;
